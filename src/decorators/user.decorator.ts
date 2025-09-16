import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuth } from '../api/interfaces/auth.interface';

/**
 * 유저 정보 데코레이터
 */
export const User = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request?.user;

  return user as IAuth.User;
});
