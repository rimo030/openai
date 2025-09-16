import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AIModel } from '../api/interfaces/ai-model.interface';
import { IAuth } from '../api/interfaces/auth.interface';
import { ITokenUsage } from '../api/interfaces/toeken-usage.interface';
import { GlobalConfig } from '../global.config';
import { AIModelsProvider } from './ai-models.provider';

export namespace TokenUsagesProvider {
  export function select() {
    return {
      select: {
        id: true,
        request_id: true,
        ai_model_id: true,
        input_token: true,
        cost_input_tokens: true,
        cached_input_token: true,
        cost_cached_input_tokens: true,
        output_token: true,
        cost_output_tokens: true,
        duration: true,
        cost_durations: true,
        created_at: true,
      },
    } satisfies Prisma.TokenUsageFindManyArgs;
  }

  export function transform(
    input: Prisma.TokenUsageGetPayload<ReturnType<typeof TokenUsagesProvider.select>>,
  ): ITokenUsage.IGetOutput {
    return {
      id: input.id,
      requestId: input.request_id,
      inputTokens: input.input_token,
      costInputTokens: Number(input.cost_input_tokens),
      cachedInputTokens: input.cached_input_token,
      costCachedInputTokens: Number(input.cost_cached_input_tokens),
      outputTokens: input.output_token,
      costOutputTokens: Number(input.cost_output_tokens),
      duration: input.duration ? Number(input.duration) : null,
      costDurations: input.cost_durations ? Number(input.duration) : null,
      createdAt: input.created_at.toISOString(),
    };
  }

  export async function create(
    auth: IAuth.User,
    AIModle: AIModel.IGetOneInput,
    input: ITokenUsage.ICreateInput,
  ): Promise<void> {
    try {
      const model = await AIModelsProvider.findByName(AIModle);

      const costInputTokens =
        ((input.inputTokens - input.cachedInputTokens) / 1_000_000) * model.costPerTextInput1MTokens;
      const costCachedInputTokens = (input.cachedInputTokens / 1_000_000) * model.costPerTextCachedInput1MTokens;
      const costOutputTokens = (input.outputTokens / 1_000_000) * model.costPerTextOutput1MTokens;
      const cost_durations = input.duration ? (input.duration * model.costPerAudio1Minutes) / 60 : null;

      await GlobalConfig.prisma.tokenUsage.create({
        data: {
          id: randomUUID(),
          user_id: auth.user.id,
          member_id: auth.member?.id ?? null,
          request_id: input.requestId,
          ai_model_id: model.id,
          input_token: input.inputTokens,
          cost_input_tokens: costInputTokens,
          cached_input_token: input.cachedInputTokens,
          cost_cached_input_tokens: costCachedInputTokens,
          output_token: input.outputTokens,
          cost_output_tokens: costOutputTokens,
          duration: input.duration,
          cost_durations: cost_durations,
          created_at: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}
