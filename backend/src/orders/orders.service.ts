import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string, paymentMode: string, address?: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Le panier est vide');
    }

    // Vérifier stock pour tous les articles
    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour "${item.product.name}" (disponible: ${item.product.stockQuantity})`,
        );
      }
      if (!item.product.isActive) {
        throw new BadRequestException(`"${item.product.name}" n'est plus disponible`);
      }
    }

    // Calculer le total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    // Générer numéro de commande
    const orderNumber = await this.generateOrderNumber();

    // Créer la commande dans une transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Créer la commande
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          totalAmount,
          paymentMode,
          userId,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
          statuses: {
            create: {
              status: 'CONFIRMED',
              note: 'Commande confirmée',
              updatedBy: userId,
            },
          },
        },
        include: {
          items: { include: { product: true } },
          statuses: true,
        },
      });

      // Décrémenter le stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // Vider le panier
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, statuses: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, statuses: true },
    });
    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: true, statuses: true, user: { select: { id: true, fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.order.count();
    return `JOGGA-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}
