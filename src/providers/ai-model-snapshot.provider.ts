import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { tags } from 'typia';
import { AIModelSnapshot } from '../api/interfaces/ai-model-snapshot.interface';

export namespace AIModelSnapshotProvider {
  export function transform(
    input: Prisma.AIModelSnapshotGetPayload<ReturnType<typeof AIModelSnapshotProvider.select>>,
  ): AIModelSnapshot.IGetOutput {
    return {
      id: input.id,
      version: input.version,
      costPerTextInput1MTokens: input.cost_per_text_input_1m_tokens.toNumber(),
      costPerTextCachedInput1MTokens: input.cost_per_text_cached_input_1m_tokens.toNumber(),
      costPerTextOutput1MTokens: input.cost_per_text_output_1m_tokens.toNumber(),
      costPerAudio1Minutes: input.cost_per_audio_1_minutes.toNumber(),
      contextLength: input.context_length,
      createdAt: input.created_at.toISOString(),
    } as const;
  }

  export function select() {
    return {
      select: {
        id: true,
        version: true,
        cost_per_text_input_1m_tokens: true,
        cost_per_text_cached_input_1m_tokens: true,
        cost_per_text_output_1m_tokens: true,
        cost_per_audio_1_minutes: true,
        context_length: true,
        created_at: true,
      },
      take: 1,
      orderBy: {
        created_at: 'desc',
      },
    } satisfies Prisma.AIModelSnapshotFindManyArgs;
  }

  export function collect(input: AIModelSnapshot.ICreateInput & { now: string & tags.Format<'date-time'> }) {
    return {
      id: randomUUID(),
      cost_per_text_input_1m_tokens: input.costPerTextInput1MTokens,
      cost_per_text_cached_input_1m_tokens: input.costPerTextCachedInput1MTokens,
      cost_per_text_output_1m_tokens: input.costPerTextOutput1MTokens,
      context_length: input.contextLength,
      version: input.version,
      cost_per_audio_1_minutes: input.costPerAudio1Minutes,
      created_at: input.now,
    } satisfies Prisma.AIModelSnapshotCreateWithoutModelInput;
  }
}
