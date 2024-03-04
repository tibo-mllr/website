import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { type Server } from 'http';

@WebSocketGateway({ cors: { origin: '*' } })
export class Gateway {
  @WebSocketServer() server: Server;
}
