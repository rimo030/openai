import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import * as Apis from '../../../src/api/functional';

export async function test_api_hello_world(connection: IConnection) {
  const response = await Apis.getHello(connection);
  typia.assert(response);
}
