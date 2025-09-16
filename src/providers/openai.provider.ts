import { IAuth } from '../api/interfaces/auth.interface';
import { IChat } from '../api/interfaces/chat.interface';
import { GlobalConfig } from '../global.config';
import { TokenUsageUtil } from '../utils/token-usage.util';
import { TokenUsagesProvider } from './token-usages.provider';

export namespace OpenAIProvider {
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
