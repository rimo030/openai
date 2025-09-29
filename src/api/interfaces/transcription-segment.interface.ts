/**
 * STT Transcription
 */
export interface ITranscriptionSegment {
  /**
   * PK. 아이디
   */
  id: string;

  /**
   * FK. Transcription 아이디
   */
  transcription_id: string;

  /**
   * 세그먼트 아이디
   */
  segment_id: number;

  /**
   * 세그먼트 시간 시간 (초)
   */
  start: number;

  /**
   * 세그먼트 종료 시간 (초)
   */
  end: number;

  /**
   * 텍스트 (내용)
   */
  text: string;

  /**
   * 신뢰도 (세그먼트 내 로그 평균)
   *
   * 0에 가까울수록 신뢰값
   */
  avgLogprob: number;

  /**
   * 압축 비율 (값이 클수록 텍스트에 반복이 많다는 신호)
   */
  compressionRatio: number;

  /**
   * 무음일 확률
   */
  noSpeechProb: number;
}

export namespace ITranscriptionSegment {
  export interface IGetOutput
    extends Pick<
      ITranscriptionSegment,
      'id' | 'segment_id' | 'start' | 'end' | 'text' | 'avgLogprob' | 'compressionRatio'
    > {}
}
