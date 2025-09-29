import { tags } from 'typia';

/**
 * STT Transcription
 */
export interface ITranscription {
  /**
   * PK. 아이디
   */
  id: string;

  /**
   *  FK. AI Model 아이디
   */
  aiModelId: string;

  /**
   * 인식된 응답 언어의 코드 (예: "en", "ko" 등)
   */
  language: string;

  /**
   * 오디오 전체 길이(초).
   */
  duration: number;

  /**
   * 전체 텍스트
   */
  text: string;

  /**
   * 데이터 저장시간
   */
  createdAt: string & tags.Format<'date-time'>;
}

export namespace ITranscription {
  export interface IGetOutput extends Pick<ITranscription, 'id' | 'language' | 'duration' | 'text' | 'createdAt'> {}
}
