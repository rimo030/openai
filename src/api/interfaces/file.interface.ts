export namespace IFile {
  /**
   * 파일 업로드 응답 타입
   */
  export interface IUploadOutput extends IFile.IListOutput {}

  /**
   * 리스트 조회 요청 타입
   */
  export interface IListInput extends Partial<Pick<IFile.IListOutput, 'purpose'>> {}

  /**
   * 리스트 조회 응답 타입
   *
   * @link https://platform.openai.com/docs/api-reference/files/object
   */
  export interface IListOutput {
    /**
     * 객체타입, 언제나 file
     */
    object: 'file';

    /**
     * OpenAI에서 발급한 아이디
     */
    id: string;

    /**
     * The intended purpose of the file
     */
    purpose:
      | 'assistants'
      | 'assistants_output'
      | 'batch'
      | 'batch_output'
      | 'fine-tune'
      | 'fine-tune-results'
      | 'vision'
      | 'user_data';

    /**
     * 업로드 된 파일의 이름 (업로드시 지정한 파일의 이름과 동일. 확장자 포함)
     */
    filename: string;

    /**
     * 업로드 된 파일의 크기
     */
    bytes: number;

    /**
     * 업로드 된 시간 (Unix timestamp)
     */
    createdAt: number;

    /**
     * 만료 시간 (Unix timestamp)
     */
    expiresAt: number | null;
  }
}
