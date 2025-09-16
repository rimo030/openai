import { tags } from 'typia';
import { IUser } from './user.interface';

export namespace IAuth {
  export interface User {
    /**
     * 유저 정보
     */
    user: Pick<IUser, 'id' | 'ip' | 'createdAt'>;

    /**
     * 멤버 정보
     *
     * member가 없다면 비회원 유저이다.
     */
    member?: {
      id: string & tags.Format<'uuid'>;
    };
  }

  export interface IToken {
    /**
     * 유저 정보
     */
    user: IUser.IGetOutput;

    /**
     * 액세스 토큰
     */
    accessToken: string & tags.MinLength<1>;

    /**
     * 리프레쉬 토큰
     */
    refreshToken: string & tags.MinLength<1>;
  }
}
