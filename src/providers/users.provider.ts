import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { IUser } from '../api/interfaces/user.interface';
import { GlobalConfig } from '../global.config';

export namespace UsersProvider {
  export function transform(input: Prisma.UserGetPayload<ReturnType<typeof UsersProvider.select>>): IUser {
    return {
      id: input.id,
      memberId: input.member_id,
      ip: input.ip,
      createdAt: input.created_at.toISOString(),
    };
  }

  export function select() {
    return {
      select: {
        id: true,
        member_id: true,
        ip: true,
        created_at: true,
      },
    } satisfies Prisma.UserFindManyArgs;
  }

  /**
   * 유저를 생성합니다.
   */
  export async function create(input: IUser.ICreateInput): Promise<IUser.IGetOutput> {
    const now = new Date().toISOString();

    const user = await GlobalConfig.prisma.user.create({
      ...UsersProvider.select(),
      data: {
        id: randomUUID(),
        member_id: null,
        ip: input.ip,
        created_at: new Date().toISOString(),
      },
    });

    return UsersProvider.transform(user);
  }

  /**
   * 유저를 조회합니다.
   */
  export async function find(id: IUser['id']): Promise<IUser | null> {
    const user = await GlobalConfig.prisma.user.findFirst({
      ...UsersProvider.select(),
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UsersProvider.transform(user);
  }
}
