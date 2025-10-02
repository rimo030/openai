import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';

/**
 * Openai 저장소에 업로드된 파일 조회
 */
export async function test_api_web_socket_file_list(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 업로드된 파일 리스트 조회
  const response = await driver.file.list({});
  typia.assert(response);

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기

  return response;
}
