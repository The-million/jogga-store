import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class DeliveryGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    // Le client peut rejoindre une room pour écouter sa commande
    const orderId = client.handshake.query.orderId as string;
    if (orderId) {
      client.join(`order:${orderId}`);
    }
  }

  @SubscribeMessage('subscribeToOrder')
  handleSubscribe(client: Socket, orderId: string) {
    client.join(`order:${orderId}`);
    return { event: 'subscribed', orderId };
  }

  // Appelé par le service pour broadcaster un changement de statut
  emitStatusChange(orderId: string, status: any) {
    this.server.to(`order:${orderId}`).emit('delivery:statusChanged', status);
  }
}
