import { Driver } from 'tgrid';
import { IAuth } from '../api/interfaces/auth.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { OpenAIProvider } from '../providers/openai.provider';

export class VectorStoreSocket implements WebSocket.VectorStore.IProvider {
  public constructor(
    private readonly driver: Driver<WebSocket.IRemote>,
    private readonly auth: IAuth.User,
  ) {}

  public async create(input: { name: string; fileIds?: string[] }) {
    const { name, fileIds } = input;
    return OpenAIProvider.VectorStore.create(name, fileIds);
  }

  public async list(input: {}) {
    return OpenAIProvider.VectorStore.list();
  }

  public async remove(input: { vectorStoreId: string }) {
    const { vectorStoreId } = input;
    return OpenAIProvider.VectorStore.remove(vectorStoreId);
  }

  public async addFile(input: { vectorStoreId: string; fileId: string }) {
    const { vectorStoreId, fileId } = input;
    return OpenAIProvider.VectorStore.addFile(vectorStoreId, fileId);
  }

  public async listFile(input: { vectorStoreId: string }) {
    const { vectorStoreId } = input;
    return OpenAIProvider.VectorStore.listFile(vectorStoreId);
  }
}
