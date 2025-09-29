import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';
import { AIModel } from '../api/interfaces/ai-model.interface';
import { ITranscriptionSegment } from '../api/interfaces/transcription-segment.interface';
import { ITranscription } from '../api/interfaces/transcription.interface';
import { GlobalConfig } from '../global.config';
import { WhisperUtil } from '../utils/whisper.util';
import { TranscriptionSegmentProvider } from './transcription-segment.provider';

export namespace TranscriptionProvider {
  export function select() {
    return {
      select: {
        id: true,
        text: true,
        duration: true,
        language: true,
        created_at: true,
        segments: TranscriptionSegmentProvider.select(),
      },
    } satisfies Prisma.TranscriptionFindManyArgs;
  }

  export function transform(
    input: Prisma.TranscriptionGetPayload<ReturnType<typeof TranscriptionProvider.select>>,
  ): ITranscription.IGetOutput & { segments: Array<ITranscriptionSegment.IGetOutput> } {
    const segments = input.segments.map((el) => TranscriptionSegmentProvider.transform(el));
    return {
      id: input.id,
      text: input.text,
      duration: Number(input.duration),
      language: input.language,
      createdAt: input.created_at.toISOString(),
      segments: segments,
    };
  }

  export async function create(
    model: AIModel.IGetOneInput,
    input: TranscriptionVerbose,
  ): Promise<ITranscription.IGetOutput & { segments: Array<ITranscriptionSegment.IGetOutput> }> {
    const fillterdSegment = input.segments?.filter((el) => WhisperUtil.calcConfidence(el) > 0.55);

    const now = new Date().toISOString();
    const transcription = await GlobalConfig.prisma.transcription.create({
      ...TranscriptionProvider.select(),
      data: {
        id: randomUUID(),
        ai_modle: {
          connect: {
            provider_name: {
              name: model.name,
              provider: model.provider,
            },
          },
        },
        text: fillterdSegment ? fillterdSegment.map((el) => el.text).join() : '', // 정상 값만 text로 필터링
        duration: input.duration,
        language: input.language,
        created_at: now,
        ...(input.segments && {
          segments: {
            createMany: {
              data: input.segments.map(
                (el): Prisma.TranscriptionSegmentCreateManyTranscriptionInput => ({
                  id: randomUUID(),
                  start: el.start,
                  end: el.end,
                  text: el.text,
                  segment_id: el.id,
                  avg_logprob: el.avg_logprob,
                  compression_ratio: el.compression_ratio,
                  no_speech_prob: el.no_speech_prob,
                }),
              ),
            },
          },
        }),
      },
    });

    return TranscriptionProvider.transform(transcription);
  }
}
