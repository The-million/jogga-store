import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, slug: true, price: true, stockQuantity: true, imageUrls: true } } },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: { include: { product: { select: { id: true, name: true, slug: true, price: true, stockQuantity: true, imageUrls: true } } } },
        },
      });
    }

    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number, variantLabel?: Record<string, string>) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produit introuvable');
    if (!product.isActive) throw new BadRequestException('Produit indisponible');
    if (product.stockQuantity < quantity) throw new BadRequestException('Stock insuffisant');

    const cart = await this.getCart(userId);

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (product.stockQuantity < newQty) throw new BadRequestException('Stock insuffisant');
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    }

    return this.prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: { product: true },
    });
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Article introuvable dans le panier');

    if (item.product.stockQuantity < quantity) throw new BadRequestException('Stock insuffisant');

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Article introuvable dans le panier');

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart(userId);
  }
}
