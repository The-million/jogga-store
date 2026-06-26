import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    prisma = { user: { findUnique: jest.fn(), create: jest.fn() } };
    jwt = { sign: jest.fn().mockReturnValue('fake-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a user and return token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'u1', email: 'test@test.com', fullName: 'Test', phone: '+2420000000', role: 'CUSTOMER',
      });

      const result = await service.register({
        email: 'test@test.com', password: 'Secret123', fullName: 'Test', phone: '+2420000000',
      });

      expect(result.access_token).toBe('fake-token');
      expect(result.user.email).toBe('test@test.com');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should reject duplicate email', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(
        service.register({ email: 'test@test.com', password: 'Secret123', fullName: 'Test', phone: '+2420000000' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const hash = await bcrypt.hash('Secret123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1', email: 'test@test.com', passwordHash: hash, fullName: 'T', phone: 'p', role: 'CUSTOMER',
      });

      const result = await service.login({ email: 'test@test.com', password: 'Secret123' });
      expect(result.access_token).toBe('fake-token');
    });

    it('should reject wrong password', async () => {
      const hash = await bcrypt.hash('Secret123', 10);
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'test@test.com', passwordHash: hash });

      await expect(
        service.login({ email: 'test@test.com', password: 'WrongPass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject unknown email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x@x.com', password: 'Secret123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
