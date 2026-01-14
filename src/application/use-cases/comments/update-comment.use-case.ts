import { HttpStatus, Injectable, NotFoundException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { UpdateCommentDto } from '../../../interface/dtos/comments/update-comment.dto';
import { Comment } from '../../../infrastructure/database/sequelize/models/comment.model';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

@Injectable()
export class UpdateCommentUseCase {
  private readonly logger = new Logger(UpdateCommentUseCase.name);
  private readonly window = new JSDOM('').window;
  private readonly purify = DOMPurify(this.window as any);

  constructor(
    private readonly commentsRepository: CommentsRepository,
  ) {}

  /**
   * Sanitizar conteúdo HTML
   */
  private sanitizeContent(content: string): string {
    return this.purify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }

  async execute(id: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<ApiResponseInterface<Comment>> {
    try {
      const comment = await this.commentsRepository.findById(id);

      if (!comment) {
        throw new NotFoundException('Comentário não encontrado');
      }

      if (comment.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para editar este comentário');
      }

      // Sanitizar conteúdo
      const sanitizedContent = this.sanitizeContent(updateCommentDto.content);

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
