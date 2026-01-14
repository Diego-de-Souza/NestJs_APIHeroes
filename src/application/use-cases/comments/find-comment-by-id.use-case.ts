import { HttpStatus, Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { Comment } from '../../../infrastructure/database/sequelize/models/comment.model';
import { CommentLike } from '../../../infrastructure/database/sequelize/models/comment-like.model';

@Injectable()
export class FindCommentByIdUseCase {
  private readonly logger = new Logger(FindCommentByIdUseCase.name);

  constructor(
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute(id: number, userId?: number): Promise<ApiResponseInterface<Comment>> {
    try {
      const comment = await this.commentsRepository.findById(id);

      if (!comment) {
        throw new NotFoundException('Comentário não encontrado');
      }

      // Buscar like/dislike do usuário se logado
      if (userId) {
        const userLike = await this.commentsRepository.findUserLike(id, userId);
        if (userLike) {
          (comment as any).userLiked = userLike.type === 'like';
          (comment as any).userDisliked = userLike.type === 'dislike';
        }
      }

      return {
        status: HttpStatus.OK,
        message: 'Comentário encontrado com sucesso',
        dataUnit: comment,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar comentário:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar comentário');
    }
  }
}
