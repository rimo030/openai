import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { WebSocketModule } from './modules/web-socket.module';

@Module({
  imports: [JwtModule.register({ global: true }), WebSocketModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
