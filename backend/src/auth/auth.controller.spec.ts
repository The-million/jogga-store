import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = { register: jest.fn(), login: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should call authService.register on POST /auth/register', async () => {
    const dto = { email: 't@t.com', password: 'Secret123', fullName: 'T', phone: '+242****0000' };
    authService.register.mockResolvedValue({ access_token: 'tok', user: { id: '1' } });
    const result = await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result.access_token).toBe('tok');
  });

  it('should call authService.login on POST /auth/login', async () => {
    const dto = { email: 't@t.com', password: 'Secret123' };
    authService.login.mockResolvedValue({ access_token: 'tok', user: { id: '1' } });
    const result = await controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
