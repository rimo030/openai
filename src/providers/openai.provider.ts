import { InternalServerErrorException } from '@nestjs/common';
import { Uploadable } from 'openai';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';
import { AIModel } from '../api/interfaces/ai-model.interface';
import { IAuth } from '../api/interfaces/auth.interface';
import { IChat } from '../api/interfaces/chat.interface';
import { ITokenUsage } from '../api/interfaces/toeken-usage.interface';
import { GlobalConfig } from '../global.config';
import { TokenUsageUtil } from '../utils/token-usage.util';
import { TokenUsagesProvider } from './token-usages.provider';

export namespace OpenAIProvider {
  export namespace Chat {
    /**
     * 채팅 기능
     */
    export async function ask(auth: IAuth.User, input: IChat.IAskInput) {
      const model = 'gpt-4.1-mini' as const;

      return GlobalConfig.OpenAI.chat.completions
        .create({
          model: model,
          messages: [{ role: 'user', content: [{ type: 'text', text: input.message }] }],
        })
        .then(async (response) => {
          const tokenUsage = TokenUsageUtil.calculate({ completion: response });
          await TokenUsagesProvider.create(
            auth,
            { provider: 'OpenAI', name: model },
            {
              requestId: input.requestId,
              inputTokens: tokenUsage.input.total,
              cachedInputTokens: tokenUsage.input.cached,
              outputTokens: tokenUsage.output.total,
              duration: null,
            },
          );

          const content = response.choices[0].message.content;
          return content;
        });
    }

    /**
     * 스트리밍 채팅 기능
     */
    export async function askStream(
      auth: IAuth.User,
      input: IChat.IAskInput,
      onChunk: (chunk: string) => void,
    ): Promise<string> {
      const model = 'gpt-4.1-mini' as const;

      const stream = await GlobalConfig.OpenAI.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: [{ type: 'text', text: input.message }] }],
        stream: true,
        stream_options: { include_usage: true },
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk(content);
        }

        if (chunk.usage) {
          const tokenUsage = TokenUsageUtil.calculate({ usage: chunk.usage });
          await TokenUsagesProvider.create(
            auth,
            { provider: 'OpenAI', name: model },
            {
              requestId: input.requestId,
              inputTokens: tokenUsage.input.total,
              cachedInputTokens: tokenUsage.input.cached,
              outputTokens: tokenUsage.output.total,
              duration: null,
            },
          );
        }
      }

      return fullResponse;
    }
  }

  export namespace Audio {
    /**
     * 오디오 파일을 받아 한국어로 전사합니다.
     */
    export async function stt(
      auth: IAuth.User,
      requestId: string,
      file: Uploadable,
    ): Promise<
      { transcriptionVerbose: TranscriptionVerbose } & { tokenUsage: ITokenUsage.IGetOutput } & {
        model: AIModel.IGetOneInput;
      }
    > {
      try {
        const model = { name: 'whisper-1', provider: 'OpenAI' } as const;

        return GlobalConfig.OpenAI.audio.transcriptions
          .create({
            /**
             * ID of the model to use. The options are `gpt-4o-transcribe`,
             * `gpt-4o-mini-transcribe`, and `whisper-1` (which is powered by our open source
             * Whisper V2 model).
             */
            model: model.name,

            /**
             * The audio file object (not file name) to transcribe, in one of these formats:
             * flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
             */
            file: file,

            /**
             * The format of the output, in one of these options: `json`, `text`, `srt`,
             * `verbose_json`, or `vtt`. For `gpt-4o-transcribe` and `gpt-4o-mini-transcribe`,
             * the only supported format is `json`.
             */
            response_format: 'verbose_json',

            /**
             * The timestamp granularities to populate for this transcription.
             * `response_format` must be set `verbose_json` to use timestamp granularities.
             * Either or both of these options are supported: `word`, or `segment`. Note: There
             * is no additional latency for segment timestamps, but generating word timestamps
             * incurs additional latency.
             */
            timestamp_granularities: ['segment'],

            /**
             * The language of the input audio. Supplying the input language in
             * [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g. `en`)
             * format will improve accuracy and latency.
             */
            language: 'ko',

            temperature: 0,
          })
          .then(async (response) => {
            /**
             * 토큰 사용량 기록
             */
            const calculate = TokenUsageUtil.calculate(response);
            const tokenUsage = await TokenUsagesProvider.create(auth, model, {
              requestId,
              inputTokens: calculate.input.total,
              cachedInputTokens: calculate.input.cached,
              outputTokens: calculate.output.total,
              duration: response.duration,
            });

            return { transcriptionVerbose: response, tokenUsage, model };
          });
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('STT Error');
      }
    }
  }
}
