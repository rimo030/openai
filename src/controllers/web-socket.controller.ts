import { WebSocketRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Driver, WebSocketAcceptor } from 'tgrid';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { SocketLogsProvider } from '../providers/socket-logs.provider';
import { WebSocketProvider } from '../providers/web-socket.provider';
import { Socket } from '../sockets/socket';

@Controller('websocket')
export class WebSocketController {
  /**
   * 소켓을 연결합니다.
   *
   * @param acceptor
   * @param driver
   */
  @WebSocketRoute()
  public async connect(
    @WebSocketRoute.Acceptor()
    acceptor: WebSocketAcceptor<WebSocket.IHeader, WebSocket.IProvider, WebSocket.IRemote>,
    @WebSocketRoute.Driver()
    driver: Driver<WebSocket.IRemote>,
  ): Promise<void> {
    const requestId = randomUUID();
    try {
      // 1. 소켓 인증
      const auth = await WebSocketProvider.authorization(acceptor.header);

      // 2. 소켓 연결 승인
      await acceptor.accept(new Socket(driver, auth)).then(() => {
        SocketLogsProvider.create(
          requestId,
          {
            header: acceptor.header,
            ip: acceptor.ip,
            data: {},
            level: 'log',
            type: 'connect',
          },
          auth,
        );
        console.debug(`[OPEN] connected`, JSON.stringify(auth, null, 2));
      });

      // 3. 소켓 종료 감지
      await acceptor.join().then(() => {
        SocketLogsProvider.create(
          requestId,
          {
            header: acceptor.header,
            ip: acceptor.ip,
            data: {},
            level: 'log',
            type: 'connect-close',
          },
          auth,
        );
        console.debug(`[CLOSE] disconnected`, JSON.stringify(auth, null, 2));
      });
    } catch (error) {
      acceptor.reject();
      SocketLogsProvider.create(requestId, {
        header: acceptor.header,
        ip: acceptor.ip,
        data: {},
        level: 'log',
        type: 'connect-reject',
      });

      console.debug(`[REJECT] ${error}`);
    }
  }
}
