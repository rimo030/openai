import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 요청에서 아이피를 추출합니다.
 */
export const ClientIp = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();

  const forwarded = request.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : request.socket.remoteAddress;

  return ip;
});
