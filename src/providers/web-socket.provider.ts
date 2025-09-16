import { UnauthorizedException } from '@nestjs/common';
import { IAuth } from '../api/interfaces/auth.interface';
import { WebSocket } from '../api/interfaces/web-socket.interface';
import { GlobalConfig } from '../global.config';
import { AuthUtil } from '../utils/auth.util';
import { JWTProvider } from './jwt-provider';
import { UsersProvider } from './users.provider';

export namespace WebSocketProvider {
  /**
   * 소켓 인증
   */
  export async function authorization(header: WebSocket.IHeader): Promise<IAuth.User> {
    const accessToken = AuthUtil.getSocketToken(header);

    if (!accessToken) {
      throw new UnauthorizedException('소켓 유저 인증 실패. 토큰이 없습니다.');
    }

    // 아이디 추출
    const { id } = JWTProvider.verify(accessToken, {
      secret: GlobalConfig.env.JWT_SECRET_USER,
    });

    // 유저 정보 조회
    const user = await UsersProvider.find(id);

    if (!user) {
      throw new UnauthorizedException('소켓 유저 인증 실패. 잘못된 유저 정보 입니다.', { cause: id });
    }
    return { user };
  }
}
