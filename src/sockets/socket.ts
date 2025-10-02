import { Driver } from 'tgrid';
import { IAuth } from '../api/interfaces/auth.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { AudioSocket } from './audio.socket';
import { ChatSocket } from './chat.socket';
import { FileSocket } from './file.socket';
import { ResponsesSocket } from './responses.socket';
import { VectorStoreSocket } from './vector-store.socket';

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

  get file() {
    return new FileSocket(this.driver, this.user);
  }

  get vectorStore() {
    return new VectorStoreSocket(this.driver, this.user);
  }

  get responses() {
    return new ResponsesSocket(this.driver, this.user);
  }
}
