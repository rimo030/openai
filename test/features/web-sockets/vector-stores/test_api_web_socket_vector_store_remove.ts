import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';
import { test_api_web_socket_vector_store_list } from './test_api_web_socket_vector_store_list';

/**
 * OpenAI 벡터스토어 삭제
 *
 * - 테스트용으로 생성한 벡터스토어를 모두 삭제합니다.
 */
export async function test_api_web_socket_vector_store_remove(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 벡터 스토어 조회
  const vectorStoreList = await test_api_web_socket_vector_store_list(connection);

  // 벡터 스토어 전체 삭제
  const deletedStore = await Promise.all(
    vectorStoreList.map((el) => driver.vectorStore.remove({ vectorStoreId: el.id })),
  );
  typia.assert(deletedStore);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기
}
