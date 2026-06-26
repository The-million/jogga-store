import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            imageUrls: true,
            isActive: true,
            stockQuantity: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((i) => {
      const urls = Array.isArray(i.product.imageUrls) ? i.product.imageUrls as string[] : [];
      return {
        id: i.id,
        addedAt: i.createdAt,
        product: {
          ...i.product,
          imageUrl: urls[0] ?? null,
          price: Number(i.product.price),
          comparePrice: i.product.comparePrice ? Number(i.product.comparePrice) : null,
        },
      };
    });
  }

  async add(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produit introuvable');

    const existing = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) throw new ConflictException('Produit déjà dans la liste de souhaits');

    return this.prisma.wishlistItem.create({ data: { userId, productId } });
  }

  async addBySlug(userId: string, slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException('Produit introuvable');
    return this.add(userId, product.id);
  }

  async remove(userId: string, productId: string) {
    await this.prisma.wishlistItem.deleteMany({ where: { userId, productId } });
    return { message: 'Retiré de la liste de souhaits' };
  }

  async removeBySlug(userId: string, slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException('Produit introuvable');
    return this.remove(userId, product.id);
  }

  async check(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!item;
  }
}
