import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Enable CORS if needed
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('paymentStatusChanged')
  handlePaymentStatusChange(client: any, payload: any): void {
    this.server.emit('paymentStatusChanged', payload);
  }
}
