import { Prisma } from '@prisma/client';
import { ITranscriptionSegment } from '../api/interfaces/transcription-segment.interface';

export namespace TranscriptionSegmentProvider {
  export function select() {
    return {
      select: {
        id: true,
        segment_id: true,
        text: true,
        start: true,
        end: true,
        avg_logprob: true,
        compression_ratio: true,
        no_speech_prob: true,
      },
    } satisfies Prisma.TranscriptionSegmentFindManyArgs;
  }

  export function transform(
    input: Prisma.TranscriptionSegmentGetPayload<ReturnType<typeof TranscriptionSegmentProvider.select>>,
  ): ITranscriptionSegment.IGetOutput {
    return {
      id: input.id,
      segment_id: input.segment_id,
      text: input.text,
      start: Number(input.start),
      end: Number(input.end),
      avgLogprob: Number(input.avg_logprob),
      compressionRatio: Number(input.compression_ratio),
    } as const;
  }
}
