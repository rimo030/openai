import { InternalServerErrorException } from '@nestjs/common';
import { Uploadable } from 'openai';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';
import { VectorStoreDeleted } from 'openai/resources/index';
import { VectorStoreFile } from 'openai/resources/vector-stores/files';
import { AIModel } from '../api/interfaces/ai-model.interface';
import { IAuth } from '../api/interfaces/auth.interface';
import { IChat } from '../api/interfaces/chat.interface';
import { IFile } from '../api/interfaces/file.interface';
import { ITokenUsage } from '../api/interfaces/toeken-usage.interface';
import { IVectorStore } from '../api/interfaces/vector-store.interface';
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

  export namespace File {
    /**
     * 파일 업로드
     *
     * OpenAI API에서는 VectorStore 등에서 사용할 파일들을 먼저 OpenAI의 파일 저장소에 업로드해야 합니다.
     */
    export async function upload(file: Uploadable, purpose: 'assistants' = 'assistants'): Promise<IFile.IUploadOutput> {
      try {
        const response = await GlobalConfig.OpenAI.files.create({
          file,
          purpose,
        });

        return {
          object: response.object,
          id: response.id,
          purpose: response.purpose,
          filename: response.filename,
          bytes: response.bytes,
          createdAt: response.created_at,
          expiresAt: response.expires_at ?? null,
        };
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('File upload failed');
      }
    }

    /**
     * 파일 조회
     *
     * OpenAI 저장소에 업로드된 파일들을 조회합니다.
     */
    export async function list(purpose?: string): Promise<Array<IFile.IListOutput>> {
      try {
        const response = await GlobalConfig.OpenAI.files.list({
          purpose,
        });

        return response.data.map(
          (el): IFile.IListOutput => ({
            object: el.object,
            id: el.id,
            purpose: el.purpose,
            filename: el.filename,
            bytes: el.bytes,
            createdAt: el.created_at,
            expiresAt: el.expires_at ?? null,
          }),
        );
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('OpenAI 파일 리스트 조회 실패.');
      }
    }
  }

  /**
   * OpenAI VectorStore
   *
   * @link https://platform.openai.com/docs/api-reference/vector-stores
   */
  export namespace VectorStore {
    /**
     * VectorStore 생성
     */
    export async function create(name: string, fileIds?: string[]): Promise<IVectorStore.ICreateOutput> {
      try {
        const response = await GlobalConfig.OpenAI.vectorStores.create({
          name,
          file_ids: fileIds,
        });

        return {
          id: response.id,
          object: response.object,
          name: response.name,
          usageBytes: response.usage_bytes,
          expiresAfter: response.expires_after ?? null,
          lastActiveAt: response.last_active_at,
          fileCounts: {
            completed: response.file_counts.completed,
            inProgress: response.file_counts.in_progress,
            cancelled: response.file_counts.cancelled,
            failed: response.file_counts.failed,
            total: response.file_counts.total,
          },
          status: response.status,
          metadata: response.metadata,
        };
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('VectorStore creation failed');
      }
    }

    /**
     * VectorStore 목록 조회
     */
    export async function list(): Promise<Array<IVectorStore.IListOutput>> {
      try {
        const response = await GlobalConfig.OpenAI.vectorStores.list();

        return response.data.map((el) => ({
          id: el.id,
          object: el.object,
          name: el.name,
          usageBytes: el.usage_bytes,
          expiresAfter: el.expires_after ?? null,
          lastActiveAt: el.last_active_at,
          fileCounts: {
            completed: el.file_counts.completed,
            inProgress: el.file_counts.in_progress,
            cancelled: el.file_counts.cancelled,
            failed: el.file_counts.failed,
            total: el.file_counts.total,
          },
          status: el.status,
          metadata: el.metadata,
        }));
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Failed to list VectorStores');
      }
    }

    /**
     * VectorStore에 파일 추가
     */
    export async function addFile(vectorStoreId: string, fileId: string): Promise<VectorStoreFile> {
      try {
        const response = await GlobalConfig.OpenAI.vectorStores.files.create(vectorStoreId, { file_id: fileId });

        return response;
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Failed to add file to VectorStore');
      }
    }

    /**
     * VectorStore에 올라간 파일 조회
     */
    export async function listFile(vectorStoreId: string): Promise<VectorStoreFile[]> {
      try {
        const response = await GlobalConfig.OpenAI.vectorStores.files.list(vectorStoreId);

        return response.data;
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Failed to add file to VectorStore');
      }
    }

    /**
     * VectorStore 삭제
     */
    export async function remove(vectorStoreId: string): Promise<VectorStoreDeleted> {
      try {
        const response = await GlobalConfig.OpenAI.vectorStores.delete(vectorStoreId);

        return response;
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Failed to delete VectorStore');
      }
    }
  }

  export namespace Responses {
    /**
     * Responses API를 사용한 RAG 질의응답
     * Vector Store를 활용하여 파일 검색 기반 응답 생성
     *
     * TODO: 응답 인터페이스 정의
     */
    export async function create(vectorStoreIds: string[], message: string): Promise<string> {
      const response = await GlobalConfig.OpenAI.responses.create({
        model: 'gpt-4.1',
        input: message,
        tools: [{ type: 'file_search', vector_store_ids: vectorStoreIds, max_num_results: 3 }],
        include: ['file_search_call.results'],
      });

      return response.output_text;
    }
  }
}
