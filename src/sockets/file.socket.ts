import { Driver } from 'tgrid';
import { IAuth } from '../api/interfaces/auth.interface';
import { IFile } from '../api/interfaces/file.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { OpenAIProvider } from '../providers/openai.provider';

export class FileSocket implements WebSocket.File.IProvider {
  public constructor(
    private readonly driver: Driver<WebSocket.IRemote>,
    private readonly auth: IAuth.User,
  ) {}

  public async upload(input: { file: { name: string; data: string }; purpose: 'assistants' }) {
    // base64 문자열을 Buffer로 변환
    const buffer = Buffer.from(input.file.data, 'base64');

    // File 객체 생성
    const file = new File([buffer], input.file.name);

    return OpenAIProvider.File.upload(file, input.purpose);
  }

  public async list(input: IFile.IListInput) {
    const { purpose } = input;
    return OpenAIProvider.File.list(purpose);
  }
}
