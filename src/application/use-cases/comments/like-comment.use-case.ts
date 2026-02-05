import { HttpStatus, Inject, Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import type { ICommentsRepository } from '../../../application/ports/out/comments.port';
import type { ILikeCommentPort } from '../../../application/ports/in/comments/like-comment.port';

@Injectable()
export class LikeCommentUseCase implements ILikeCommentPort {
  private readonly logger = new Logger(LikeCommentUseCase.name);

  constructor(
    @Inject('ICommentsRepository') private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(commentId: string, userId: string): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>> {
    try {
      const comment = await this.commentsRepository.findById(commentId);

      if (!comment) {
        throw new NotFoundException('Comentário não encontrado');
      }

      // Verificar se já existe like/dislike
      const existingLike = await this.commentsRepository.findUserLike(commentId, userId);

      if (existingLike) {
        if (existingLike.type === 'like') {
          // Já deu like, remover
          await this.commentsRepository.removeLike(commentId, userId);
        } else {
          // Tinha dado dislike, trocar para like
          await this.commentsRepository.createLike({
            commentId,
            userId,
            type: 'like',
          });
        }
      } else {
        // Criar novo like
        await this.commentsRepository.createLike({
          commentId,
          userId,
          type: 'like',
        });
      }

      // Atualizar contadores
      await this.commentsRepository.updateCounters(commentId);

      // Buscar comentário atualizado para retornar contadores
      const updatedComment = await this.commentsRepository.findById(commentId);
      if (!updatedComment) {
        throw new InternalServerErrorException('Erro ao buscar comentário atualizado');
      }

      return {
        status: HttpStatus.OK,
        message: existingLike?.type === 'like' ? 'Like removido' : 'Like adicionado',
        data: [{
          likes: updatedComment.likesCount,
          dislikes: updatedComment.dislikesCount,
        }],
      };
    } catch (error) {
      this.logger.error('Erro ao dar like no comentário:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao dar like no comentário');
    }
  }
}
