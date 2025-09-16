import { tags } from 'typia';
import { IUser } from './user.interface';

export interface ISocketLog {
  /**
   * PK 아이디
   */
  id: string & tags.Format<'uuid'>;

  /**
   * 요청 아이디
   */
  requestId: string;

  /**
   * 아이피 주소
   */
  ip: string | null;

  /**
   * FK. 유저 아이디
   */
  userId: IUser['id'];

  /**
   * FK. 멤버 아이디
   */
  memberId: (string & tags.Format<'uuid'>) | null;

  /**
   * 소켓 타입
   */
  type: 'connect' | 'connect-reject' | 'connect-close' | 'ask' | 'ask-stream';

  /**
   * 로그 레벨
   *
   * - log: 단순 로그
   * - debug: 디버그 로그
   * - warn: 경고
   * - error: 에러 발생
   * - fatal: 소켓 다운
   */
  level: 'log' | 'debug' | 'warn' | 'error' | 'fatal';

  /**
   * 소켓 요청 헤더
   */
  header: object | null;

  /**
   * 로그를 남길 데이터
   */
  data: object | null;

  /**
   * 로그 생성 시점
   */
  createdAt: string & tags.Format<'date-time'>;
}

export namespace ISocketLog {
  export interface ICreateInput extends Pick<ISocketLog, 'type' | 'level' | 'ip' | 'header' | 'data'> {}
}
