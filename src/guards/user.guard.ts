import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuth } from '../api/interfaces/auth.interface';
import { GlobalConfig } from '../global.config';
import { JWTProvider } from '../providers/jwt-provider';
import { UsersProvider } from '../providers/users.provider';
import { AuthUtil } from '../utils/auth.util';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = AuthUtil.getBearerToken(request);

      if (!accessToken) {
        throw new UnauthorizedException('유저 인증 실패. 토큰이 없습니다.');
      }

      // 아이디 추출
      const { id } = JWTProvider.verify(accessToken, {
        secret: GlobalConfig.env.JWT_SECRET_USER,
      });

      // 유저 정보 조회
      const user = await UsersProvider.find(id);

      if (!user) {
        throw new UnauthorizedException('유저 인증 실패. 잘못된 유저 정보 입니다.', { cause: id });
      }

      request.user = { user } satisfies IAuth.User;

      return user ? true : false;
    } catch (error) {
      console.error('[User Guard Error]', error);
      throw new UnauthorizedException('유저 인증 실패. 에러가 발생했습니다.');
    }
  }
}
