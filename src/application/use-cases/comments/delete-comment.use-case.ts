import { HttpStatus, Inject, Injectable, NotFoundException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import type { ICommentsRepository } from '../../../application/ports/out/comments.port';
import type { IDeleteCommentPort } from '../../../application/ports/in/comments/delete-comment.port';

@Injectable()
export class DeleteCommentUseCase implements IDeleteCommentPort {
  private readonly logger = new Logger(DeleteCommentUseCase.name);

  constructor(
    @Inject('ICommentsRepository') private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(id: string, userId: string, isAdmin: boolean = false): Promise<ApiResponseInterface<void>> {
    try {
      const comment = await this.commentsRepository.findById(id);

      if (!comment) {
        throw new NotFoundException('Comentário não encontrado');
      }

      if (comment.userId !== userId && !isAdmin) {
        throw new ForbiddenException('Você não tem permissão para deletar este comentário');
      }

      await this.commentsRepository.softDelete(id);

      return {
        status: HttpStatus.OK,
        message: 'Comentário deletado com sucesso',
      };
    } catch (error) {
      this.logger.error('Erro ao deletar comentário:', error);
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao deletar comentário');
    }
  }
}
