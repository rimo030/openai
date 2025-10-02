import { VectorStoreDeleted } from 'openai/resources/index';
import { VectorStoreFile } from 'openai/resources/vector-stores/files';
import { IAudio } from './audio.interface';
import { IChat } from './chat.interface';
import { IFile } from './file.interface';
import { IVectorStore } from './vector-store.interface';

export namespace WebSocket {
  /**
   * Header
   * - 클라이언트가 처음 연결할 때 보내는 초기 데이터 (보통 인증이나 보안용으로 활용 가능).
   */
  export interface IHeader {
    /**
     * 소켓의 타입
     *
     * - chat: 채팅 타입 소켓
     */
    type: 'chat';

    /**
     * 인증 토큰
     */
    authorization?: string;
  }

  /**
   * Provider
   *
   * - 서버가 클라이언트에 제공하는 기능 집합.
   */
  export interface IProvider {
    /**
     * Chat
     */
    chat: WebSocket.Chat.IProvider;

    /**
     * Audio
     */
    audio: WebSocket.Audio.IProvider;

    /**
     * File
     */
    file: WebSocket.File.IProvider;

    /**
     * VectorStore
     */
    vectorStore: WebSocket.VectorStore.IProvider;

    /**
     * Response
     */
    responses: WebSocket.Responses.IProvider;
  }

  /**
   * Remote (Listener)
   *
   * - 클라이언트가 서버에 제공하는 기능 집합
   */
  export interface IRemote {
    /**
     * Chat
     */
    chat: WebSocket.Chat.IRemote;
  }

  /**
   * 채팅 소켓 함수들 정의
   */
  export namespace Chat {
    // 채팅 기능 Provider
    export interface IProvider {
      /**
       * 채팅 응답 생성
       */
      ask: (input: IChat.ISendInput) => Promise<IChat.ISendOutput>;

      /**
       * 스트리밍 채팅 응답 생성
       */
      askStream: (input: IChat.ISendStreamInput) => Promise<IChat.ISendStreamOutput>;
    }

    // 채팅 기능 Remote
    export interface IRemote {
      /**
       * 스트리밍 메시지 수신 콜백
       */
      onAskStream: (input: IChat.IOnChatStream) => void;
    }
  }

  /**
   * 오디오 소켓 함수 정의
   */
  export namespace Audio {
    // 오디오 기능 Provider
    export interface IProvider {
      /**
       * STT (음성 -> 텍스트)
       */
      stt: (input: IAudio.ISttInput) => Promise<IAudio.ISttOutput>;
    }

    // 오디오 기능 Remote
    export interface IRemote {}
  }

  /**
   * 파일 소켓 함수 정의
   */
  export namespace File {
    // 오디오 기능 Provider
    export interface IProvider {
      /**
       * 파일 업로드
       */
      upload: (input: { file: { name: string; data: string }; purpose: 'assistants' }) => Promise<IFile.IUploadOutput>;

      /**
       * 파일 조회
       */
      list: (input: IFile.IListInput) => Promise<Array<IFile.IListOutput>>;
    }

    // 파일 기능 Remote
    export interface IRemote {}
  }

  /**
   * VectorStore 소켓 함수 정의
   */
  export namespace VectorStore {
    // VectorStore 기능 Provider
    export interface IProvider {
      /**
       * VectorStore 생성
       */
      create: (input: IVectorStore.ICreateInput & { fileIds?: string[] }) => Promise<IVectorStore.ICreateOutput>;

      /**
       * VectorStore 리스트 조회
       */
      list: (input: {}) => Promise<Array<IVectorStore.IListOutput>>;

      /**
       * VectorStore에 파일 추가
       */
      addFile: (input: { vectorStoreId: string; fileId: string }) => Promise<VectorStoreFile>;

      /**
       * VectorStore에 올라간 파일 조회
       */
      listFile: (input: { vectorStoreId: string }) => Promise<VectorStoreFile[]>;

      /**
       * VectorStore 삭제
       */
      remove: (input: { vectorStoreId: string }) => Promise<VectorStoreDeleted>;
    }

    // VectorStore 기능 Remote
    export interface IRemote {}
  }

  /**
   * Response API 소켓 함수 정의
   */
  export namespace Responses {
    // Response 기능 Provider
    export interface IProvider {
      /**
       * Responses API를 사용한 RAG 질의응답
       * Vector Store를 활용하여 파일 검색 기반 응답 생성
       */
      create: (inpnut: { vectorStoreIds: string[]; message: string }) => Promise<string>;
    }

    // Response 기능 Remote
    export interface IRemote {}
  }
}
