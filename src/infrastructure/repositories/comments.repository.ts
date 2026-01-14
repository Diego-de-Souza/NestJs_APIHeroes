import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions, Order } from 'sequelize';
import { Comment } from '../database/sequelize/models/comment.model';
import { CommentLike } from '../database/sequelize/models/comment-like.model';
import { User } from '../database/sequelize/models/user.model';
import { Article } from '../database/sequelize/models/article.model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment) private readonly commentModel: typeof Comment,
    @InjectModel(CommentLike) private readonly commentLikeModel: typeof CommentLike,
  ) {}

  /**
   * Criar comentário
   */
  async create(data: {
    articleId: number;
    userId: number;
    content: string;
    parentId?: number | null;
  }): Promise<Comment> {
    return await this.commentModel.create({
      articleId: data.articleId,
      userId: data.userId,
      content: data.content,
      parentId: data.parentId || null,
    });
  }

  /**
   * Buscar comentário por ID
   */
  async findById(id: number, includeDeleted: boolean = false): Promise<Comment | null> {
    const where: WhereOptions = { id };
    if (!includeDeleted) {
      where.isDeleted = false;
    }

    return await this.commentModel.findOne({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullname', 'nickname'] },
        { model: Article, as: 'article' },
        { model: Comment, as: 'parent' },
      ],
    });
  }

  /**
   * Buscar comentários com filtros
   */
  async findAll(filters: {
    articleId?: number;
    userId?: number;
    parentId?: number | null;
    sortBy?: 'newest' | 'oldest' | 'mostLiked';
    limit?: number;
    offset?: number;
  }): Promise<Comment[]> {
    const where: WhereOptions = {
      isDeleted: false,
    };

    if (filters.articleId) {
      where.articleId = filters.articleId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    // Ordenação
    let order: Order = [];
    switch (filters.sortBy) {
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      case 'mostLiked':
        order = [['likesCount', 'DESC'], ['createdAt', 'DESC']];
        break;
      case 'newest':
      default:
        order = [['createdAt', 'DESC']];
        break;
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    return await this.commentModel.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullname', 'nickname'] },
        { model: Comment, as: 'replies', where: { isDeleted: false }, required: false },
      ],
      order,
      limit,
      offset,
    });
  }

  /**
   * Atualizar comentário
   */
  async update(id: number, data: { content: string }): Promise<[number]> {
    return await this.commentModel.update(
      {
        content: data.content,
        isEdited: true,
      },
      {
        where: { id, isDeleted: false },
      },
    );
  }

  /**
   * Soft delete comentário
   */
  async softDelete(id: number): Promise<[number]> {
    return await this.commentModel.update(
      { isDeleted: true },
      {
        where: { id, isDeleted: false },
      },
    );
  }

  /**
   * Buscar like/dislike de usuário em comentário
   */
  async findUserLike(commentId: number, userId: number): Promise<CommentLike | null> {
    return await this.commentLikeModel.findOne({
      where: {
        commentId,
        userId,
      },
    });
  }

  /**
   * Criar like/dislike
   */
  async createLike(data: {
    commentId: number;
    userId: number;
    type: 'like' | 'dislike';
  }): Promise<CommentLike> {
    // Verificar se já existe e atualizar ou criar novo
    const existing = await this.findUserLike(data.commentId, data.userId);

    if (existing) {
      existing.type = data.type;
      return await existing.save();
    }

    return await this.commentLikeModel.create({
      commentId: data.commentId,
      userId: data.userId,
      type: data.type,
    });
  }

  /**
   * Remover like/dislike
   */
  async removeLike(commentId: number, userId: number): Promise<number> {
    return await this.commentLikeModel.destroy({
      where: {
        commentId,
        userId,
      },
    });
  }

  /**
   * Atualizar contadores de likes/dislikes
   */
  async updateCounters(commentId: number): Promise<void> {
    const likesCount = await this.commentLikeModel.count({
      where: { commentId, type: 'like' },
    });

    const dislikesCount = await this.commentLikeModel.count({
      where: { commentId, type: 'dislike' },
    });

    await this.commentModel.update(
      {
        likesCount,
        dislikesCount,
      },
      {
        where: { id: commentId },
      },
    );
  }

  /**
   * Buscar likes/dislikes de múltiplos comentários para um usuário
   */
  async findUserLikesForComments(
    commentIds: number[],
    userId: number,
  ): Promise<CommentLike[]> {
    if (commentIds.length === 0) {
      return [];
    }

    return await this.commentLikeModel.findAll({
      where: {
        commentId: {
          [Op.in]: commentIds,
        },
        userId,
      },
    });
  }

  /**
   * Verificar se artigo existe
   */
  async articleExists(articleId: number): Promise<boolean> {
    const article = await Article.findByPk(articleId);
    return article !== null;
  }

  /**
   * Verificar se comentário pai existe
   */
  async parentExists(parentId: number): Promise<boolean> {
    const parent = await this.commentModel.findOne({
      where: { id: parentId, isDeleted: false },
    });
    return parent !== null;
  }
}
