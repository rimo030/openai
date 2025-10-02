import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';
import { test_api_web_socket_vector_store_add_file } from '../vector-stores/test_api_web_socket_vector_store_add_file';

/**
 * OpenAI 벡터 스토어에 파일 업로드
 *
 * - 벡터스토어를 생성한뒤 파일을 추가합니다.
 */
export async function test_api_web_socket_responses_create(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 벡터 스토어 생성, 파일 추가
  const { vectorStore } = await test_api_web_socket_vector_store_add_file(connection);

  const response = await driver.responses.create({
    message: '마감 기한은 언제인가요?',
    vectorStoreIds: [vectorStore.id],
  });
  typia.assert(response);
  console.log(response);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기
}
