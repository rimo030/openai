import { ITokenUsage } from './toeken-usage.interface';
import { ITranscriptionSegment } from './transcription-segment.interface';
import { ITranscription } from './transcription.interface';

export namespace IAudio {
  /**
   * STT 요청 인터페이스
   */
  export interface ISttInput {
    file:
      | {
          type: 'path'; // 파일 경로
          path: string;
        }
      | {
          type: 'buffer'; // 파일 스트림
          buffer: File;
        }
      | {
          type: 'url'; // 저장소
          storage: 'aws-s3';
          url: string;
        };
  }

  /**
   * STT 응답 인터페이스
   */
  export interface ISttOutput {
    /**
     * STT 결과
     */
    transcription: ITranscription.IGetOutput & {
      /**
       * 세그먼트 데이터
       */
      segments: Array<ITranscriptionSegment.IGetOutput>;
    };

    /**
     * 사용된 비용
     */
    tokenUsage: ITokenUsage.IGetOutput;
  }
}
