import { HttpStatus, Inject, Injectable, NotFoundException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import type { ICommentsRepository } from '../../../application/ports/out/comments.port';
import type { IUpdateCommentPort } from '../../../application/ports/in/comments/update-comment.port';
import { UpdateCommentDto } from '../../../interface/dtos/comments/update-comment.dto';
import { Comment } from '../../../infrastructure/database/sequelize/models/comment.model';
import { sanitizeContent } from '../../../shared/utils/sanitize-content.util';

@Injectable()
export class UpdateCommentUseCase implements IUpdateCommentPort {
  private readonly logger = new Logger(UpdateCommentUseCase.name);

  constructor(
    @Inject('ICommentsRepository') private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<ApiResponseInterface<Comment>> {
    try {
      const comment = await this.commentsRepository.findById(id);

      if (!comment) {
        throw new NotFoundException('Comentário não encontrado');
      }

      if (comment.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para editar este comentário');
      }

      // Sanitizar conteúdo
      const sanitizedContent = sanitizeContent(updateCommentDto.content);

      // Atualizar comentário
      await this.commentsRepository.update(id, { content: sanitizedContent });

      // Buscar comentário atualizado
      const updatedComment = await this.commentsRepository.findById(id);
      if (!updatedComment) {
        throw new InternalServerErrorException('Erro ao buscar comentário atualizado');
      }

      return {
        status: HttpStatus.OK,
        message: 'Comentário atualizado com sucesso',
        dataUnit: updatedComment,
      };
    } catch (error) {
      this.logger.error('Erro ao atualizar comentário:', error);
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar comentário');
    }
  }
}
