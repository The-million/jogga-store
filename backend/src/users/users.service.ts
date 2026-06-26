import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const USER_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  avatarUrl: true,
  birthDate: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    // Check uniqueness if email/phone changed
    if (dto.email) {
      const exists = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (exists) throw new ConflictException('Cet email est déjà utilisé');
    }
    if (dto.phone) {
      const exists = await this.prisma.user.findFirst({
        where: { phone: dto.phone, NOT: { id } },
      });
      if (exists) throw new ConflictException('Ce numéro est déjà utilisé');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.fullName && { fullName: dto.fullName }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.birthDate !== undefined && { birthDate: dto.birthDate ? new Date(dto.birthDate) : null }),
      },
      select: USER_SELECT,
    });
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Mot de passe actuel incorrect');

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: newHash },
    });
    return { message: 'Mot de passe modifié avec succès' };
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { ...USER_SELECT, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
