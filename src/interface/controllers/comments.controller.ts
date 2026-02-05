import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos/comments/create-comment.dto';
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto';
import { CommentFiltersDto } from '../dtos/comments/comment-filters.dto';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { Comment } from '../../infrastructure/database/sequelize/models/comment.model';
import { CommentWithUser } from '../../domain/interfaces/comment.interface';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import type { ICreateCommentPort } from '../../application/ports/in/comments/create-comment.port';
import type { IFindCommentsPort } from '../../application/ports/in/comments/find-comments.port';
import type { IFindCommentByIdPort } from '../../application/ports/in/comments/find-comment-by-id.port';
import type { IUpdateCommentPort } from '../../application/ports/in/comments/update-comment.port';
import type { IDeleteCommentPort } from '../../application/ports/in/comments/delete-comment.port';
import type { ILikeCommentPort } from '../../application/ports/in/comments/like-comment.port';
import type { IDislikeCommentPort } from '../../application/ports/in/comments/dislike-comment.port';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(
    @Inject('ICreateCommentPort') private readonly createCommentPort: ICreateCommentPort,
    @Inject('IFindCommentsPort') private readonly findCommentsPort: IFindCommentsPort,
    @Inject('IFindCommentByIdPort') private readonly findCommentByIdPort: IFindCommentByIdPort,
    @Inject('IUpdateCommentPort') private readonly updateCommentPort: IUpdateCommentPort,
    @Inject('IDeleteCommentPort') private readonly deleteCommentPort: IDeleteCommentPort,
    @Inject('ILikeCommentPort') private readonly likeCommentPort: ILikeCommentPort,
    @Inject('IDislikeCommentPort') private readonly dislikeCommentPort: IDislikeCommentPort,
  ) {}

  private getUserId(req: Request): string | undefined {
    const user = req['user'];
    const id = user?.id ?? user?.sub;
    return id != null ? String(id) : undefined;
  }

  private isAdmin(req: Request): boolean {
    const user = req['user'];
    if (!user) return false;
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some(
        (role: any) =>
          role.role === 'admin' || role.role === 'root' || (role.role === 'admin' && role.access === 'FULL_ACCESS')
      );
    }
    return user.nickname === 'root';
  }

  @Get()
  async findAll(@Query() filters: CommentFiltersDto, @Req() req: Request): Promise<ApiResponseInterface<CommentWithUser>> {
    try {
      const userId = this.getUserId(req);
      return await this.findCommentsPort.execute(filters, userId);
    } catch (error) {
      this.logger.error('Erro ao buscar comentários:', error);
      throw new BadRequestException({ status: 500, message: `Erro ao buscar comentários: ${error.message}` });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<Comment>> {
    try {
      const userId = this.getUserId(req);
      return await this.findCommentByIdPort.execute(id, userId);
    } catch (error) {
      this.logger.error('Erro ao buscar comentário:', error);
      throw new BadRequestException({ status: 500, message: `Erro ao buscar comentário: ${error.message}` });
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request): Promise<ApiResponseInterface<Comment>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) throw new BadRequestException('Usuário não autenticado');
      return await this.createCommentPort.execute(createCommentDto, userId);
    } catch (error) {
      this.logger.error('Erro ao criar comentário:', error);
      throw new BadRequestException({ status: 500, message: `Erro ao criar comentário: ${error.message}` });
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request
  ): Promise<ApiResponseInterface<Comment>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) throw new BadRequestException('Usuário não autenticado');
      return await this.updateCommentPort.execute(id, updateCommentDto, userId);
    } catch (error) {
      this.logger.error('Erro ao atualizar comentário:', error);
      throw new BadRequestException({ status: 500, message: `Erro ao atualizar comentário: ${error.message}` });
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<void>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) throw new BadRequestException('Usuário não autenticado');
      const isAdmin = this.isAdmin(req);
      return await this.deleteCommentPort.execute(id, userId, isAdmin);
    } catch (error) {
      this.logger.error('Erro ao deletar comentário:', error);
      throw new BadRequestException({ status: 500, message: `Erro ao deletar comentário: ${error.message}` });
    }
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  async likeComment(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) throw new BadRequestException('Usuário não autenticado');
      return await this.likeCommentPort.execute(id, userId);
    } catch (error) {
      this.logger.error('Erro ao dar like no comentário:', error);
      throw new BadRequestException({ status: 500, message: `Erro ao dar like no comentário: ${error.message}` });
    }
  }

  @Post(':id/dislike')
  @UseGuards(AuthGuard)
  async dislikeComment(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) throw new BadRequestException('Usuário não autenticado');
      return await this.dislikeCommentPort.execute(id, userId);
    } catch (error) {
      this.logger.error('Erro ao dar dislike no comentário:', error);
      throw new BadRequestException({ status: 500, message: `Erro ao dar dislike no comentário: ${error.message}` });
    }
  }
}
