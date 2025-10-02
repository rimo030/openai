import { TestValidator } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';
import { test_api_web_socket_vector_store_add_file } from './test_api_web_socket_vector_store_add_file';

/**
 * OpenAI 벡터 스토어에 업로드된 파일 리스트 조회
 */
export async function test_api_web_socket_vector_store_list_file(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 벡터 스토어 생성 및 파일 업로드
  const { vectorStore } = await test_api_web_socket_vector_store_add_file(connection);

  // 리스트에 올라간 파일 목록 조회
  const response = await driver.vectorStore.listFile({ vectorStoreId: vectorStore.id });
  typia.assert(response);

  TestValidator.equals('조회된 파일이 1개 이상이어야한다.', response.length > 0, true);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기

  return response;
}
