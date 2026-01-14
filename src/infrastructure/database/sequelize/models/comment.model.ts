import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
  Index,
} from 'sequelize-typescript';
import { Article } from './article.model';
import { User } from './user.model';
import { CommentLike } from './comment-like.model';

@Table({
  tableName: 'comments',
  timestamps: true,
  underscored: true,
})
@Index(['article_id'])
@Index(['user_id'])
@Index(['parent_id'])
@Index(['created_at'])
@Index(['is_deleted'])
export class Comment extends Model<Comment> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => Article)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'article_id',
  })
  articleId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'parent_id',
  })
  parentId: number | null;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'likes_count',
  })
  likesCount: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'dislikes_count',
  })
  dislikesCount: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_edited',
  })
  isEdited: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_deleted',
  })
  isDeleted: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  updatedAt: Date;

  // Relations
  @BelongsTo(() => Article)
  article: Article;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Comment, { foreignKey: 'parent_id', as: 'parent' })
  parent: Comment;

  @HasMany(() => Comment, { foreignKey: 'parent_id', as: 'replies' })
  replies: Comment[];

  @HasMany(() => CommentLike, { foreignKey: 'comment_id', as: 'likes' })
  likes: CommentLike[];
}
