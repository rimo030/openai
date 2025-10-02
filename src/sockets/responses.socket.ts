import { Driver } from 'tgrid';
import { IAuth } from '../api/interfaces/auth.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { OpenAIProvider } from '../providers/openai.provider';

export class ResponsesSocket implements WebSocket.Responses.IProvider {
  public constructor(
    private readonly driver: Driver<WebSocket.IRemote>,
    private readonly auth: IAuth.User,
  ) {}

  public async create(input: { vectorStoreIds: string[]; message: string }) {
    const { vectorStoreIds, message } = input;
    return OpenAIProvider.Responses.create(vectorStoreIds, message);
  }
}
