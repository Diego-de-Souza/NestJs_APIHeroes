import { HttpStatus, Inject, Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import type { ICommentsRepository } from '../../../application/ports/out/comments.port';
import type { IFindCommentByIdPort } from '../../../application/ports/in/comments/find-comment-by-id.port';
import { Comment } from '../../../infrastructure/database/sequelize/models/comment.model';

@Injectable()
export class FindCommentByIdUseCase implements IFindCommentByIdPort {
  private readonly logger = new Logger(FindCommentByIdUseCase.name);

  constructor(
    @Inject('ICommentsRepository') private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(id: string, userId?: string): Promise<ApiResponseInterface<Comment>> {
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
