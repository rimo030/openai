import { Module } from '@nestjs/common';
import { WebSocketController } from '../controllers/web-socket.controller';

@Module({
  imports: [],
  controllers: [WebSocketController],
})
export class WebSocketModule {}
