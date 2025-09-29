import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { tags } from 'typia';
import { AIModel } from '../api/interfaces/ai-model.interface';
import { GlobalConfig } from '../global.config';
import { AIModelSnapshotProvider } from './ai-model-snapshot.provider';

export namespace AIModelsProvider {
  export function transform(
    input: Prisma.AIModelGetPayload<ReturnType<typeof AIModelsProvider.select>>,
  ): AIModel.IGetOutput {
    const snapshot = AIModelSnapshotProvider.transform(input.snapshots.at(0)!);

    return {
      id: input.id,
      createdAt: input.created_at.toISOString(),
      name: input.name,
      provider: input.provider as AIModel['provider'],
      costPerTextInput1MTokens: snapshot.costPerTextInput1MTokens,
      costPerTextCachedInput1MTokens: snapshot.costPerTextCachedInput1MTokens,
      costPerTextOutput1MTokens: snapshot.costPerTextOutput1MTokens,
      costPerAudio1Minutes: snapshot.costPerAudio1Minutes,
      updatedAt: snapshot.createdAt,
    } as const;
  }

  export function select() {
    return {
      select: {
        id: true,
        created_at: true,
        name: true,
        provider: true,
        snapshots: AIModelSnapshotProvider.select(),
      },
    } satisfies Prisma.AIModelFindManyArgs;
  }

  /**
   * 모델 이름으로 모델을 조회합니다.
   */
  export async function findByName(input: AIModel.IGetOneInput): Promise<AIModel.IGetOutput> {
    const model = await GlobalConfig.prisma.aIModel.findUnique({
      ...AIModelsProvider.select(),
      where: {
        provider_name: {
          name: input.name,
          provider: input.provider,
        },
      },
    });

    if (!model) {
      throw new BadRequestException('AI 모델 조회 에러.', { cause: input });
    }
    return AIModelsProvider.transform(model);
  }

  /**
   * 해당 이름을 가진 모델이 등록되어있지 않다면 생성합니다.
   */
  export async function upsert(input: AIModel.IUpsertInput & { now: string & tags.Format<'date-time'> }) {
    const snapshot = AIModelSnapshotProvider.collect(input);
    await GlobalConfig.prisma.aIModel.upsert({
      update: {},
      create: {
        id: randomUUID(),
        name: input.name,
        provider: input.provider,
        snapshots: { create: snapshot },
        created_at: input.now,
      },
      where: { name: input.name },
    });
  }

  /** AI 모델 시딩 삽입 */
  export async function seeding(now: string & tags.Format<'date-time'>) {
    await Promise.all([
      // gpt-4.1-mini
      AIModelsProvider.upsert({
        provider: 'OpenAI',
        name: 'gpt-4.1-mini',
        version: null,
        costPerTextInput1MTokens: 0.4,
        costPerTextCachedInput1MTokens: 0.1,
        costPerTextOutput1MTokens: 1.6,
        costPerAudio1Minutes: 0,
        contextLength: 1_047_576,
        now,
      }),

      // whisper-1
      AIModelsProvider.upsert({
        provider: 'OpenAI',
        name: 'whisper-1',
        version: null,
        costPerTextInput1MTokens: 0,
        costPerTextCachedInput1MTokens: 0,
        costPerTextOutput1MTokens: 0,
        costPerAudio1Minutes: 0.006,
        contextLength: 0,
        now,
      }),
    ]);
  }
}
