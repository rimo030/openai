import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { IAuth } from '../api/interfaces/auth.interface';
import { ISocketLog } from '../api/interfaces/socket-log.interface';
import { GlobalConfig } from '../global.config';

export namespace SocketLogsProvider {
  /**
   * 소켓 로그를 생성합니다.
   */
  export async function create(
    requestId: ISocketLog['requestId'],
    input: ISocketLog.ICreateInput,
    auth?: IAuth.User,
  ): Promise<void> {
    await GlobalConfig.prisma.socketLog.create({
      data: {
        id: randomUUID(),
        ip: auth?.user.ip ?? input.ip,
        user_id: auth?.user.id,
        member_id: auth?.member?.id ?? null,
        request_id: requestId,
        level: input.level,
        type: input.type,
        header: input.header ?? Prisma.JsonNull,
        data: input.data ?? Prisma.JsonNull,
        created_at: new Date().toISOString(),
      },
    });
  }
}
