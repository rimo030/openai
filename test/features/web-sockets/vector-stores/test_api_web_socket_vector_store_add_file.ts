import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { test_api_web_socket_file_upload } from '../files/test_api_web_socket_file_upload';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';
import { test_api_web_socket_vector_store_create } from './test_api_web_socket_vector_store_create';

/**
 * OpenAI 벡터 스토어에 파일 업로드
 *
 * - 벡터스토어를 생성한뒤 파일을 추가합니다.
 */
export async function test_api_web_socket_vector_store_add_file(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 벡터 스토어 생성, 파일 추가
  const vectorStore = await test_api_web_socket_vector_store_create(connection);
  const file = await test_api_web_socket_file_upload(connection);

  // 벡터 스토어에 파일 업로드
  const response = await driver.vectorStore.addFile({ vectorStoreId: vectorStore.id, fileId: file.id });
  typia.assert(response);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기

  return { vectorStore, file };
}
