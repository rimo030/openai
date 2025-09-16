import { tags } from 'typia';
import { AIModel } from './ai-model.interface';

/**
 * 토큰 사용량 및 비용
 */
export interface ITokenUsage {
  /**
   * PK. 아이디
   */
  id: string & tags.Format<'uuid'>;

  /**
   * 요청 아이디
   *
   * 하나의 API 요청 또는 하나의 소켓 요청은 동일한 request_id를 가진다.
   */
  requestId: string & tags.Format<'uuid'>;

  /**
   * FK. 유저 아이디
   */
  userId: string & tags.Format<'uuid'>;

  /**
   * FK. 사용한 멤버 아이디
   */
  memberId: (string & tags.Format<'uuid'>) | null;

  /**
   * FK. 모델 아이디
   *
   * 사용한 모델
   */
  aIModelId: AIModel['id'];

  /**
   * input 토큰 사용량
   */
  inputTokens: number;

  /**
   * input 토큰 비용 (USD)
   */
  costInputTokens: number;

  /**
   * cached Input 토큰 사용량
   */
  cachedInputTokens: number;

  /**
   * cached Input 토큰 비용 (USD)
   */
  costCachedInputTokens: number;

  /**
   * output 토큰 사용량
   */
  outputTokens: number;

  /**
   * output 토큰 비용 (USD)
   */
  costOutputTokens: number;

  /**
   * 오디오 모델을 사용한 경우, 사용한 오디오 음성 길이
   */
  duration: number | null;

  /**
   * 오디오 토큰 비용 (USD)
   */
  costDurations: number | null;

  /**
   * 생성 시점
   */
  createdAt: string & tags.Format<'date-time'>;
}

export namespace ITokenUsage {
  export interface ICreateInput
    extends Pick<ITokenUsage, 'requestId' | 'inputTokens' | 'cachedInputTokens' | 'outputTokens' | 'duration'> {}

  export interface IGetOutput
    extends Pick<
        ITokenUsage,
        'id' | 'createdAt' | 'costInputTokens' | 'costCachedInputTokens' | 'costOutputTokens' | 'costDurations'
      >,
      ITokenUsage.ICreateInput {}
}
