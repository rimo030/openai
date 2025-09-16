import { tags } from 'typia';

export namespace IChat {
  /**
   * 채팅 요청 인터페이스
   */
  export interface ISendInput {
    /**
     * 사용자의 질문
     */
    message: string;
  }

  /**
   * 채팅 응답 인터페이스
   */
  export interface ISendOutput {
    /**
     * 요청 아이디
     */
    requestId: string & tags.Format<'uuid'>;

    /**
     * 응답 텍스트
     */
    message: string | null;
  }

  /**
   * 채팅 스트림 요청 인터페이스
   */
  export interface ISendStreamInput extends ISendInput {}

  /**
   * 채팅 스트림 응답 입터페이스
   */
  export interface ISendStreamOutput {
    /**
     * 요청 아이디
     */
    requestId: string & tags.Format<'uuid'>;

    /**
     * 최종 응답 전체 텍스트
     */
    message: string | null;
  }

  /**
   * LLM 채팅 요청객체
   */
  export interface IAskInput extends IChat.ISendInput {
    /**
     * 요청 아이디
     */
    requestId: string & tags.Format<'uuid'>;

    /**
     * 이전 동안 사용자와 나눈 대화 목록
     */
    chattings?: Array<string>;
  }

  /**
   * [Remote] 스트리밍 채팅 응답 객체
   */
  export interface IOnChatStream {
    /**
     * 요청 아이디
     */
    requestId: string;

    /**
     * 청크 단위 응답
     */
    chunk: string;

    /**
     * 스트리밍 완료 여부
     */
    isComplete: boolean;
  }
}
