import { IAuth } from '../api/interfaces/auth.interface';
import { IUser } from '../api/interfaces/user.interface';
import { GlobalConfig } from '../global.config';
import { JWTProvider } from './jwt-provider';

export namespace AuthProvider {
  /**
   * Access Token과 Refresh Token을 발급한다.
   */
  export function createUserToken(user: IUser.IGetOutput): IAuth.IToken {
    const payload = user;

    const accessToken = JWTProvider.sign(payload, {
      secret: GlobalConfig.env.JWT_SECRET_USER,
      expiresIn: GlobalConfig.env.JWT_EXPIRATION_TIME,
    });

    const refreshToken = JWTProvider.sign(payload, {
      secret: GlobalConfig.env.JWT_REFRESH_SECRET_USER,
      expiresIn: GlobalConfig.env.JWT_REFRESH_EXPIRATION_TIME,
    });

    return { user, accessToken, refreshToken };
  }
}
