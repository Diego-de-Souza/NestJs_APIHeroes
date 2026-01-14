import { HttpStatus, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { CommentFiltersDto } from '../../../interface/dtos/comments/comment-filters.dto';
import { CommentWithUser } from '../../../domain/interfaces/comment.interface';
import { CommentLike } from '../../../infrastructure/database/sequelize/models/comment-like.model';

@Injectable()
export class FindCommentsUseCase {
  private readonly logger = new Logger(FindCommentsUseCase.name);

  constructor(
    private readonly commentsRepository: CommentsRepository,
  ) {}

  /**
   * Construir árvore de comentários
   */
  private buildCommentTree(comments: any[], userLikes?: CommentLike[]): CommentWithUser[] {
    const commentMap = new Map<number, CommentWithUser>();
    const rootComments: CommentWithUser[] = [];

    // Criar mapa de likes do usuário
    const likeMap = new Map<number, 'like' | 'dislike'>();
    if (userLikes) {
      userLikes.forEach((like) => {
        likeMap.set(like.commentId, like.type);
      });
    }

    // Mapear todos os comentários
    comments.forEach((comment) => {
      const commentData = comment.get ? comment.get({ plain: true }) : comment;
      const commentWithUser: CommentWithUser = {
        ...commentData,
        replies: [],
        userLiked: likeMap.get(commentData.id) === 'like',
        userDisliked: likeMap.get(commentData.id) === 'dislike',
      };
      commentMap.set(commentData.id, commentWithUser);
    });

    // Construir árvore
    comments.forEach((comment) => {
      const commentData = comment.get ? comment.get({ plain: true }) : comment;
      if (commentData.parentId && commentMap.has(commentData.parentId)) {
        const parent = commentMap.get(commentData.parentId)!;
        if (!parent.replies) {
          parent.replies = [];
        }
        parent.replies.push(commentMap.get(commentData.id)!);
      } else {
        rootComments.push(commentMap.get(commentData.id)!);
      }
    });

    return rootComments;
  }

  async execute(filters: CommentFiltersDto, userId?: number): Promise<ApiResponseInterface<CommentWithUser>> {
    try {
      // Buscar comentários
      const comments = await this.commentsRepository.findAll({
        articleId: filters.articleId,
        userId: filters.userId,
        parentId: filters.articleId ? null : undefined, // Se filtrar por artigo, buscar apenas raiz
        sortBy: filters.sortBy,
        limit: filters.limit || 50,
        offset: filters.offset || 0,
      });

      // Buscar likes/dislikes do usuário se logado
      let userLikes: CommentLike[] = [];
      if (userId && comments.length > 0) {
        const commentIds = comments.map((c) => c.id);
        userLikes = await this.commentsRepository.findUserLikesForComments(commentIds, userId);
      }

      // Construir árvore de comentários
      const commentTree = this.buildCommentTree(comments, userLikes);

      return {
        status: HttpStatus.OK,
        message: 'Comentários encontrados com sucesso',
        data: commentTree as any,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar comentários:', error);
      throw new InternalServerErrorException('Erro ao buscar comentários');
    }
  }
}
