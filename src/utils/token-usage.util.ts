import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';
import { ChatCompletion } from 'openai/resources/chat';
import { CompletionUsage } from 'openai/resources/completions';

export namespace TokenUsageUtil {
  export interface IComponent {
    /**
     * Total token usage.
     */
    total: number;

    /**
     * Input token usage of detailed.
     */
    input: IInput;

    /**
     * Output token usage of detailed.
     */
    output: IOutput;
  }

  /**
   * Input token usage of detailed.
   */
  export interface IInput {
    /**
     * Total amount of input token uasge.
     */
    total: number;

    /**
     * Cached token usage.
     */
    cached: number;
  }

  /**
   * Output token usage of detailed.
   */
  export interface IOutput {
    /**
     *  Total amount of output token usage.
     */
    total: number;

    /**
     * Reasoning token usage.
     */
    reasoning: number;

    /**
     * Prediction token usage.
     */
    accepted_prediction: number;

    /**
     * Rejected prediction token usage.
     */
    rejected_prediction: number;

    /**
     * 오디오 길이
     *
     * null이라면 오디오 처리 모델이 아님을 의미
     */
    duration: number | null;
  }

  /**
   * 토큰 사용량을 계산합니다.
   *
   * @param props 토큰의 사용량 정보 혹은 챗 생성 결과를 전달
   * @returns Input, output 토큰 사용량 및 전체 사용량
   */
  export function calculate(
    props: { usage: CompletionUsage } | { completion: ChatCompletion } | TranscriptionVerbose,
  ): TokenUsageUtil.IComponent {
    // ----
    // COMPONENT
    // ----
    const component: TokenUsageUtil.IComponent = init();
    if ('duration' in props) {
      component.output.duration = props.duration;
      return component;
    }

    const usage = 'usage' in props ? props.usage : props.completion.usage;
    if (usage) {
      // TOTAL
      component.total += usage.total_tokens;

      // PROMPT
      component.input.total += usage.prompt_tokens;
      component.input.total += usage.prompt_tokens_details?.audio_tokens ?? 0;
      component.input.cached += usage.prompt_tokens_details?.cached_tokens ?? 0;

      // COMPLETION
      component.output.total += usage.completion_tokens;
      component.output.accepted_prediction += usage.completion_tokens_details?.accepted_prediction_tokens ?? 0;
      component.output.reasoning += usage.completion_tokens_details?.reasoning_tokens ?? 0;
      component.output.rejected_prediction += usage.completion_tokens_details?.rejected_prediction_tokens ?? 0;
    }

    return component;
  }

  function init() {
    const component = (): TokenUsageUtil.IComponent => ({
      total: 0,
      input: {
        total: 0,
        cached: 0,
      },
      output: {
        total: 0,
        reasoning: 0,
        accepted_prediction: 0,
        rejected_prediction: 0,
        duration: null, // whipser가 호출한 오디오 파일의 길이를 의미한다.
      },
    });

    return component();
  }
}
