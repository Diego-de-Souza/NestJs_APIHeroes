import { Comment } from '../../infrastructure/database/sequelize/models/comment.model';
import { User } from '../../infrastructure/database/sequelize/models/user.model';

export interface CommentWithUser extends Omit<Comment, 'user' | 'replies'> {
  user?: User;
  userLiked?: boolean;
  userDisliked?: boolean;
  replies?: CommentWithUser[];
}

export interface CommentTree extends CommentWithUser {
  replies: CommentTree[];
}
