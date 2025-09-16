import { tags } from 'typia';

/**
 * 유저
 */
export interface IUser {
  /**
   * PK. 유저 아이디
   */
  id: string & tags.Format<'uuid'>;

  /**
   * 회원 아이디
   */
  memberId: (string & tags.Format<'uuid'>) | null;

  /**
   * 아이피
   */
  ip: string;

  /**
   * 유저 생성 날짜
   */
  createdAt: string & tags.Format<'date-time'>;
}

export namespace IUser {
  /**
   * 유저 생성 요청
   */
  export interface ICreateInput extends Pick<IUser, 'ip'> {}

  /**
   * 유저 조회 응답
   */
  export interface IGetOutput extends Pick<IUser, 'id' | 'createdAt'> {}
}
