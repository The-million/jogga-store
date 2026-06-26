import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
})
export class DeliveryGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string) ||
      (client.handshake.headers?.authorization as string)?.replace('Bearer ', '');

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      });
      (client as any).userId = payload.sub;

      const orderId = client.handshake.query.orderId as string;
      if (orderId) {
        client.join(`order:${orderId}`);
      }
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('subscribeToOrder')
  handleSubscribe(client: Socket, orderId: string) {
    client.join(`order:${orderId}`);
    return { event: 'subscribed', orderId };
  }

  emitStatusChange(orderId: string, status: any) {
    this.server.to(`order:${orderId}`).emit('delivery:statusChanged', status);
  }
}
