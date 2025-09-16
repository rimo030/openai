import { tags } from 'typia';
import { AIModel } from './ai-model.interface';

export interface AIModelSnapshot {
  /**
   * PK. 스냅샷 아이디
   */
  id: string & tags.Format<'uuid'>;

  /**
   * AI 모델 아이디
   */
  modelId: AIModel['id'];

  /**
   * 모델 버전 (예: 4o)
   *
   * null인 경우, 모르거나 지정되지 않은 것을 의미한다.
   */
  version: string | null;

  /**
   * 최대 지원 토큰 길이 (예: 128000)
   */
  contextLength: number | null;

  /**
   * 입력 토큰당 텍스트 비용 (USD)
   *
   * 음성 파일의 경우에도 프롬프트를 넣을 수 있기 때문에 0의 값이 아닐 수 있다.
   */
  costPerTextInput1MTokens: number;

  /**
   * 캐시된 입력 토큰당 텍스트 비용 (USD)
   *
   * 음성 파일의 경우에도 프롬프트를 넣을 수 있기 때문에 0의 값이 아닐 수 있다.
   */
  costPerTextCachedInput1MTokens: number;

  /**
   * 출력 토큰당 텍스트 비용 (USD)
   */
  costPerTextOutput1MTokens: number;

  /**
   * 1분 당 비용
   *
   * 달러를 기준으로 한다.
   */
  costPerAudio1Minutes: number;

  /**
   * 스냅샷 생성 날짜
   */
  createdAt: string & tags.Format<'date-time'>;
}

export namespace AIModelSnapshot {
  /**
   * AI 모델 스냅샷 생성 요청 타입
   */
  export interface ICreateInput
    extends Pick<
        AIModelSnapshot,
        | 'costPerTextInput1MTokens'
        | 'costPerTextCachedInput1MTokens'
        | 'costPerTextOutput1MTokens'
        | 'costPerAudio1Minutes'
      >,
      Partial<Pick<AIModelSnapshot, 'contextLength' | 'version'>> {}

  /**
   * AI 모델 스냅샷 조회 응답 타입
   */
  export interface IGetOutput
    extends Pick<
      AIModelSnapshot,
      | 'id'
      | 'costPerTextInput1MTokens'
      | 'costPerTextCachedInput1MTokens'
      | 'costPerTextOutput1MTokens'
      | 'costPerAudio1Minutes'
      | 'contextLength'
      | 'version'
      | 'createdAt'
    > {}
}
