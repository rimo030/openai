import { IChat } from './chat.interface';

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
}
