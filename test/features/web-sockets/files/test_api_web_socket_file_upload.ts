import { IConnection } from '@nestia/fetcher';
import { readFileSync } from 'fs';
import { join } from 'path';
import typia from 'typia';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';
import { test_api_web_socket_file_list } from './test_api_web_socket_file_list';

/**
 * OpenAI 저장소에 파일 업로드 기능 테스트. (test.md 라는 이름을 가진 파일을 업로드.)
 */
export async function test_api_web_socket_file_upload(connection: IConnection) {
  const list = await test_api_web_socket_file_list(connection);

  const fileName = 'test.md';
  const exist = list.find((el) => el.filename === fileName);

  /**
   * 이미 테스트 파일이 업로드 되어있다면 업로드 하지 않음
   */
  if (!exist) {
    // 소켓 통신 시작
    const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

    // 테스트 파일을 base64로 인코딩하여 전송
    const filePath = join(process.cwd(), 'test/features/web-sockets/files/assets/' + fileName);
    const fileBuffer = readFileSync(filePath);
    const fileData = fileBuffer.toString('base64');

    const response = await driver.file.upload({ file: { name: fileName, data: fileData }, purpose: 'assistants' });
    typia.assert(response);

    // 소켓 통신 종료
    await connector.close();
    await new Promise((resolve) => setTimeout(resolve, 100)); // close 이벤트가 처리될 시간을 주기 위해 잠깐 대기

    return response;
  }
  console.debug('이미 테스트 파일이 업로드 되어있음.');
  return exist;
}
