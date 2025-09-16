import { WebSocket } from '../api/interfaces/web-socket.interface';

export namespace AuthUtil {
  /**
   * API BearerToken 토큰 추출 유틸 함수
   */
  export function getBearerToken(request: any): string | null {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  /**
   * WebSocket 토큰 추출 유틸 함수
   */
  export function getSocketToken(request: WebSocket.IHeader): string | null {
    const authHeader = request.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
