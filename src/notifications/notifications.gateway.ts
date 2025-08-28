import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: any;

  sendToUser(userId: string, data: any) {
    this.server?.to(`user_${userId}`).emit('notification', data);
  }

  sendToAll(data: any) {
    this.server?.emit('notification', data);
  }
}