import { IConnection } from '@nestia/fetcher';
import * as Apis from '../../../src/api/functional';
import { WebSocket } from '../../../src/api/interfaces/web-socket.interface';

export async function test_api_web_socket_connect(connection: IConnection, remote?: WebSocket.IRemote) {
  const _remote: WebSocket.IRemote = {
    chat: {
      onAskStream: remote?.chat.onAskStream ?? ((input) => {}),
    },
  };

  // 커넥션 생성
  const { connector, driver } = await Apis.websocket.connect(connection, _remote);

  // 커넥션 반환
  return { connector, driver };
}
