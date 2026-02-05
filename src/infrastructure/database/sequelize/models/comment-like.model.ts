import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { Comment } from './comment.model';
import { User } from './user.model';

@Table({
  tableName: 'comment_likes',
  timestamps: true,
  underscored: true,
  updatedAt: false, // Não precisamos de updated_at nesta tabela
  indexes: [
    {
      name: 'uk_comment_like_user',
      fields: ['comment_id', 'user_id'],
      unique: true,
    },
    {
      name: 'idx_comment_likes_comment_id',
      fields: ['comment_id'],
    },
    {
      name: 'idx_comment_likes_user_id',
      fields: ['user_id'],
    },
    {
      name: 'idx_comment_likes_type',
      fields: ['type'],
    },
  ],
})
export class CommentLike extends Model<CommentLike> {
  @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
  })
  id: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
    field: 'comment_id',
  })
  commentId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
    field: 'user_id',
  })
  userId: string;

  @Column({
    type: DataType.ENUM('like', 'dislike'),
    allowNull: false,
  })
  type: 'like' | 'dislike';

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  createdAt: Date;

  // Relations
  @BelongsTo(() => Comment)
  comment: Comment;

  @BelongsTo(() => User)
  user: User;
}
