import { tags } from 'typia';
import { AIModelSnapshot } from './ai-model-snapshot.interface';

export interface AIModel {
  /**
   * PK 아이디
   */
  id: string & tags.Format<'uuid'>;

  /**
   * 모델의 이름으로 유니크한 값이다.
   */
  name: string;

  /**
   * 모델 제공 플랫폼 (ex. OpenAI)
   */
  provider: 'OpenAI';

  /**
   * 모델 등록 시간
   */
  createdAt: string & tags.Format<'uuid'>;
}

export namespace AIModel {
  /**
   * AI 모델 생성 요청 타입
   */
  export interface ICreateInput extends Pick<AIModel, 'name' | 'provider'>, AIModelSnapshot.ICreateInput {}

  /**
   * AI 모델 조회 또는 생성 요청 타입
   */
  export interface IUpsertInput extends AIModel.ICreateInput {}

  /**
   * 모델 조회 요청 타입
   */
  export interface IGetOneInput extends Pick<AIModel, 'name' | 'provider'> {}

  /**
   * 모델 조회 응답 타입 (가장 최신의 가격정보 포함)
   */
  export interface IGetOutput
    extends AIModel,
      Pick<
        AIModelSnapshot,
        | 'costPerTextInput1MTokens'
        | 'costPerTextCachedInput1MTokens'
        | 'costPerTextOutput1MTokens'
        | 'costPerAudio1Minutes'
      > {
    /**
     * 스냅샷 생성 시간
     */
    updatedAt: AIModelSnapshot['createdAt'];
  }
}
