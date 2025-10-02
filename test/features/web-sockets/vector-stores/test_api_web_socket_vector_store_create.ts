import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';

/**
 * OpenAI에 벡터스토어 생성
 */
export async function test_api_web_socket_vector_store_create(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 백터 스토어 생성
  const response = await driver.vectorStore.create({ name: new Date().toISOString() });
  typia.assert(response);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기

  return response;
}
