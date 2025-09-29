import { Driver } from 'tgrid';
import { IAuth } from '../api/interfaces/auth.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { AudioSocket } from './audio.socket';
import { ChatSocket } from './chat.socket';

export class Socket implements WebSocket.IProvider {
  public constructor(
    private readonly driver: Driver<WebSocket.IRemote>,
    private readonly user: IAuth.User,
  ) {}

  get chat() {
    return new ChatSocket(this.driver, this.user);
  }

  get audio() {
    return new AudioSocket(this.driver, this.user);
  }
}
