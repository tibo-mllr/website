import { type Server } from 'http';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: '*' } })
export class Gateway {
  @WebSocketServer() server: Server;
}
