import { HttpStatus, Inject, Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import type { ICommentsRepository } from '../../../application/ports/out/comments.port';
import type { ICreateCommentPort } from '../../../application/ports/in/comments/create-comment.port';
import { CreateCommentDto } from '../../../interface/dtos/comments/create-comment.dto';
import { Comment } from '../../../infrastructure/database/sequelize/models/comment.model';
import { sanitizeContent } from '../../../shared/utils/sanitize-content.util';

@Injectable()
export class CreateCommentUseCase implements ICreateCommentPort {
  private readonly logger = new Logger(CreateCommentUseCase.name);

  constructor(
    @Inject('ICommentsRepository') private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(createCommentDto: CreateCommentDto, userId: string): Promise<ApiResponseInterface<Comment>> {
    try {
      // Validar que o artigo existe
      const articleExists = await this.commentsRepository.articleExists(createCommentDto.articleId);
      if (!articleExists) {
        throw new NotFoundException('Artigo não encontrado');
      }

      // Validar que o comentário pai existe (se fornecido)
      if (createCommentDto.parentId) {
        const parentExists = await this.commentsRepository.parentExists(createCommentDto.parentId);
        if (!parentExists) {
          throw new NotFoundException('Comentário pai não encontrado');
        }
      }

      // Sanitizar conteúdo
      const sanitizedContent = sanitizeContent(createCommentDto.content);

      // Criar comentário
      const comment = await this.commentsRepository.create({
        articleId: createCommentDto.articleId,
        userId,
        content: sanitizedContent,
        parentId: createCommentDto.parentId || null,
      });

      // Buscar comentário criado com relações
      const createdComment = await this.commentsRepository.findById(comment.id, false);
      if (!createdComment) {
        throw new InternalServerErrorException('Erro ao buscar comentário criado');
      }

      return {
        status: HttpStatus.CREATED,
        message: 'Comentário criado com sucesso',
        dataUnit: createdComment,
      };
    } catch (error) {
      this.logger.error('Erro ao criar comentário:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar comentário');
    }
  }
}
