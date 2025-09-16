import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { IAuth } from '../api/interfaces/auth.interface';
import { ClientIp as Ip } from '../decorators/ip.decorator';
import { AuthProvider } from '../providers/auth.provider';
import { UsersProvider } from '../providers/users.provider';

@Controller('auth')
export class AuthController {
  /**
   * User를 생성하고 UserToken을 발급한다.
   */
  @TypedRoute.Post('user')
  async createUser(@Ip() ip: string): Promise<IAuth.IToken> {
    const user = await UsersProvider.create({ ip });
    return AuthProvider.createUserToken(user);
  }
}
