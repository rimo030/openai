import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import * as Apis from '../../../src/api/functional';

/**
 * 유저 생성 API 테스트
 */
export async function test_api_create_user(connection: IConnection) {
  const response = await Apis.auth.user.createUser(connection);
  typia.assert(response);
  return response;
}
