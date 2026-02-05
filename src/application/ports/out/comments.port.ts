import { Comment } from "src/infrastructure/database/sequelize/models/comment.model";
import { CommentLike } from "src/infrastructure/database/sequelize/models/comment-like.model";

/** Port OUT: contrato do repositório de comentários. UseCase → Port → Repository. */
export interface ICommentsRepository {
  create(data: { articleId: string; userId: string; content: string; parentId?: string | null }): Promise<Comment>;
  findById(id: string, includeDeleted?: boolean): Promise<Comment | null>;
  findAll(filters: {
    articleId?: string;
    userId?: string;
    parentId?: string | null;
    sortBy?: 'newest' | 'oldest' | 'mostLiked';
    limit?: number;
    offset?: number;
  }): Promise<Comment[]>;
  update(id: string, data: { content: string }): Promise<[number]>;
  softDelete(id: string): Promise<[number]>;
  findUserLike(commentId: string, userId: string): Promise<CommentLike | null>;
  createLike(data: { commentId: string; userId: string; type: 'like' | 'dislike' }): Promise<CommentLike>;
  removeLike(commentId: string, userId: string): Promise<number>;
  updateCounters(commentId: string): Promise<void>;
  findUserLikesForComments(commentIds: string[], userId: string): Promise<CommentLike[]>;
  articleExists(articleId: string): Promise<boolean>;
  parentExists(parentId: string): Promise<boolean>;
}
