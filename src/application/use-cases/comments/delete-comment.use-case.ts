import { HttpStatus, Injectable, NotFoundException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';

@Injectable()
export class DeleteCommentUseCase {
  private readonly logger = new Logger(DeleteCommentUseCase.name);

  constructor(
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute(id: number, userId: number, isAdmin: boolean = false): Promise<ApiResponseInterface<void>> {
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
