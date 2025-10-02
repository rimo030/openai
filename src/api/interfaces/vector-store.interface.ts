export namespace IVectorStore {
  /**
   * 벡터 스토어 생성 요청
   */
  export interface ICreateInput extends Pick<IVectorStore.ICreateOutput, 'name'> {}

  /**
   * 백터 스토어 생성 응답
   */
  export interface ICreateOutput {
    /**
     * OpenAI에서 발급한 고유 아이디. vs_... 형식
     */
    id: string;

    /**
     * 타입. 오직 vector_store
     */
    object: 'vector_store';

    /**
     * 저장소 별칭 (고유한 값이 아님)
     */
    name: string;

    /**
     * The total number of bytes used by the files in the vector store
     */
    usageBytes: number;

    /**
     * The Unix timestamp (in seconds) for when the vector store was last active.
     */
    lastActiveAt: number | null;

    /**
     *
     */
    fileCounts: {
      /**
       * The number of files that are currently being processed.
       */
      inProgress: number;

      /**
       * The number of files that have been successfully processed.
       */
      completed: number;

      /**
       * The number of files that were cancelled.
       */
      cancelled: number;

      /**
       * The number of files that have failed to process.
       */
      failed: number;

      /**
       * The total number of files.
       */
      total: number;
    };

    /**
     * The status of the vector store.
     */
    status: 'expired' | 'in_progress' | 'completed';

    /**
     * The expiration policy for a vector store.
     */
    expiresAfter: null | {
      /**
       * Anchor timestamp after which the expiration policy applies.
       */
      anchor: string;

      /**
       * he number of days after the anchor time that the vector store will expire.
       */
      days: number;
    };

    /**
     * Set of 16 key-value pairs that can be attached to an object.
     */
    metadata: object | null;
  }

  export interface IListOutput extends ICreateOutput {}
}
