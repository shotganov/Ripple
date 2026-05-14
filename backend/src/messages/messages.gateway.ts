import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

const corsOrigins = [
  'http://127.0.0.1:5501',
  'http://localhost:5501',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://172.18.0.1:5173',
  'http://192.168.56.1:5173',
];

@WebSocketGateway({
  cors: {
    origin: corsOrigins,
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  constructor(private jwt: JwtService) {}

  handleConnection(socket: Socket) {
    const token =
      (socket.handshake.auth as { token?: string } | undefined)?.token ??
      socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      socket.disconnect(true);
      return;
    }

    try {
      const payload = this.jwt.verify<{ userId: number }>(token);
      socket.data.userId = payload.userId;
      socket.join(`user:${payload.userId}`);
      this.logger.log(`socket ${socket.id} connected as user ${payload.userId}`);
    } catch {
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket) {
    if (socket.data?.userId) {
      this.logger.log(`socket ${socket.id} disconnected`);
    }
  }

  emitToUser(userId: number, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
