import { IConnection } from '@nestia/fetcher';
import { readdir } from 'fs/promises';
import { extname, join } from 'path';
import typia from 'typia';
import { IAudio } from '../../../../src/api/interfaces/audio.interface';
import { test_api_web_socket_connect } from '../test_api_web_socket_connect';

/**
 * 오디오 웹소켓 STT 기능
 */
export async function test_api_web_socket_audio_stt(connection: IConnection) {
  // 소켓 통신 시작
  const { connector, driver } = await test_api_web_socket_connect(connection); // 커넥션 생성

  // 해당 폴더에 있는 오디오 파일리스트 STT 진행
  const audioFile = join(process.cwd(), 'test/features/web-sockets/audio/assets');
  const files = await readdir(audioFile);
  const responses: Array<IAudio.ISttOutput> = [];

  for (const file of files) {
    // STT 요청
    const response = await driver.audio.stt({
      file: { type: 'path', path: join(audioFile, file), extension: extname(file) },
    });
    typia.assert(response);

    responses.push(response);
  }

  // 소켓 통신 종료
  await connector.close();
  await new Promise((resolve) => setTimeout(resolve, 100));
}
