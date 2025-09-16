import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';

/**
 * 사용자는 채팅 기능을 사용할수 있다.
 */
export async function test_api_web_socket_chat(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 채팅
  const { message } = await driver.chat.ask({ message: '안녕하세요.' });
  typia.assert(message);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기
}
