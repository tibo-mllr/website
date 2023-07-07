import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({ cors: { origin: '*' } })
export class Gateway {
  @WebSocketServer() server: Server;
}
