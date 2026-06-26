import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    // If new address is default, unset all other defaults first
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // If no addresses exist yet, auto-set as default
    const count = await this.prisma.address.count({ where: { userId } });
    const isDefault = dto.isDefault ?? count === 0;

    return this.prisma.address.create({
      data: { ...dto, userId, isDefault },
    });
  }

  async update(id: string, userId: string, dto: Partial<CreateAddressDto>) {
    await this.assertOwnership(id, userId);

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  async setDefault(id: string, userId: string) {
    await this.assertOwnership(id, userId);
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.assertOwnership(id, userId);
    await this.prisma.address.delete({ where: { id } });
    return { message: 'Adresse supprimée' };
  }

  private async assertOwnership(id: string, userId: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('Adresse introuvable');
    if (address.userId !== userId) throw new ForbiddenException('Accès refusé');
    return address;
  }
}
