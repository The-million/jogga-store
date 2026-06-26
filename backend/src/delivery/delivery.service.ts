import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryGateway } from './delivery.gateway';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: DeliveryGateway,
  ) {}

  async updateStatus(orderId: string, status: string, note?: string, eta?: string, updatedBy?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Commande introuvable');

    const deliveryStatus = await this.prisma.deliveryStatus.create({
      data: {
        orderId,
        status: status as any,
        note: note || null,
        eta: eta ? new Date(eta) : null,
        updatedBy: updatedBy || 'system',
      },
    });

    // Broadcast via WebSocket
    this.gateway.emitStatusChange(orderId, {
      id: deliveryStatus.id,
      status: deliveryStatus.status,
      note: deliveryStatus.note,
      eta: deliveryStatus.eta,
      createdAt: deliveryStatus.createdAt,
    });

    return deliveryStatus;
  }

  async getStatusHistory(orderId: string) {
    return this.prisma.deliveryStatus.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getActiveOrders() {
    return this.prisma.order.findMany({
      where: {
        statuses: {
          none: { status: { in: ['DELIVERED', 'CANCELLED'] } },
        },
      },
      include: {
        items: { include: { product: { select: { name: true, price: true } } } },
        statuses: { orderBy: { createdAt: 'desc' }, take: 1 },
        user: { select: { fullName: true, phone: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
