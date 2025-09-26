import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { Driver } from 'tgrid';
import { tags } from 'typia';
import { IAudio } from '../api/interfaces/audio.interface';
import { IAuth } from '../api/interfaces/auth.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { OpenAIProvider } from '../providers/openai.provider';
import { SocketLogsProvider } from '../providers/socket-logs.provider';
import { TranscriptionProvider } from '../providers/transcription.provider';

export class AudioSocket implements WebSocket.Audio.IProvider {
  public constructor(
    private readonly driver: Driver<WebSocket.IRemote>,
    private readonly auth: IAuth.User,
  ) {}

  /**
   * 채팅 응답 반환
   */
  public async stt(input: IAudio.ISttInput): Promise<IAudio.ISttOutput> {
    const requestId = randomUUID();
    const { transcriptionVerbose, tokenUsage, model } = await this.handleStt(requestId, input);
    const transcription = await TranscriptionProvider.create(model, transcriptionVerbose);

    SocketLogsProvider.create(
      requestId,
      {
        type: 'stt',
        ip: null,
        header: null,
        data: {},
        level: 'log',
      },
      this.auth,
    );

    return { transcription, tokenUsage };
  }

  private async handleStt(requestId: string & tags.Format<'uuid'>, input: IAudio.ISttInput) {
    if (input.file.type === 'buffer') {
      return OpenAIProvider.stt(this.auth, requestId, input.file.buffer);
    } else if (input.file.type === 'path') {
      const file = createReadStream(input.file.path);
      return OpenAIProvider.stt(this.auth, requestId, file);
    } else {
      throw new BadRequestException('현재 지원하지 않는 형식입니다.');
    }
  }
}
