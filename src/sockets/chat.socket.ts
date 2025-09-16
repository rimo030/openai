import { randomUUID } from 'crypto';
import { Driver } from 'tgrid';
import { IAuth } from '../api/interfaces/auth.interface';
import { IChat } from '../api/interfaces/chat.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { OpenAIProvider } from '../providers/openai.provider';
import { SocketLogsProvider } from '../providers/socket-logs.provider';

export class ChatSocket implements WebSocket.Chat.IProvider {
  public constructor(
    private readonly driver: Driver<WebSocket.IRemote>,
    private readonly auth: IAuth.User,
  ) {}

  /**
   * 채팅 응답 반환
   */
  public async ask(input: IChat.ISendInput): Promise<IChat.ISendOutput> {
    const requestId = randomUUID();
    const message = await OpenAIProvider.ask(this.auth, { ...input, requestId });

    SocketLogsProvider.create(
      requestId,
      {
        ip: null,
        header: null,
        data: {},
        level: 'log',
        type: 'ask',
      },
      this.auth,
    );

    return { requestId, message };
  }

  /**
   * 스트리밍 채팅 응답 반환
   */
  public async askStream(input: IChat.ISendInput): Promise<IChat.ISendOutput> {
    const requestId = randomUUID();

    const message = await OpenAIProvider.askStream(this.auth, { ...input, requestId }, (chunk: string) => {
      // 클라이언트에게 스트리밍 청크 전송
      this.driver.chat.onAskStream({
        requestId: requestId,
        chunk,
        isComplete: false,
      });
    });

    // 스트리밍 완료 신호 전송
    this.driver.chat.onAskStream({
      requestId: requestId,
      chunk: '',
      isComplete: true,
    });

    SocketLogsProvider.create(
      requestId,
      {
        ip: null,
        header: null,
        data: {},
        level: 'log',
        type: 'ask-stream',
      },
      this.auth,
    );

    return { requestId, message };
  }
}
