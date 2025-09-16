import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import * as Apis from '../../../../src/api/functional';
import { WebSocket } from '../../../../src/api/interfaces/web-socket.interface';

/**
 * 사용자는 스트리밍 채팅 기능을 사용할 수 있다.
 */
export async function test_api_chat_stream(connection: IConnection) {
  let streamedChunks: string[] = [];
  let isStreamComplete = false;

  const remote: WebSocket.IRemote = {
    chat: {
      onAskStream: (data) => {
        // ConsoleUtil.cyan('스트리밍 청크:', data.chunk); // 콘솔에 스트리밍 내용 출력
        streamedChunks.push(data.chunk);
        if (data.isComplete) {
          isStreamComplete = true;
        }
      },
    },
  };

  // 소켓 통신 시작
  const { connector, driver } = await Apis.websocket.connect(connection, remote);

  // 스트리밍 채팅
  const response = await driver.chat.askStream({ message: '안녕하세요.' });
  typia.assert(response);

  // 스트리밍이 완료될 때까지 대기
  while (!isStreamComplete) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // ConsoleUtil.magenta('전체 스트리밍된 메시지:', streamedChunks.join(''));
  // ConsoleUtil.magenta('최종 메시지:', response.message);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100));
}
