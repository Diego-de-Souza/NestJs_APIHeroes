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
  ParseIntPipe,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CommentsService } from '../../application/services/comments.service';
import { CreateCommentDto } from '../dtos/comments/create-comment.dto';
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto';
import { CommentFiltersDto } from '../dtos/comments/comment-filters.dto';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { Comment } from '../../infrastructure/database/sequelize/models/comment.model';
import { CommentWithUser } from '../../domain/interfaces/comment.interface';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Guard opcional - permite acesso sem autenticação
   */
  private getUserId(req: Request): number | undefined {
    const user = req['user'];
    return user?.id || user?.sub;
  }

  /**
   * Verificar se usuário é admin
   */
  private isAdmin(req: Request): boolean {
    const user = req['user'];
    if (!user) return false;
    
    // Verificar roles
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some(
        (role: any) =>
          role.role === 'admin' ||
          role.role === 'root' ||
          (role.role === 'admin' && role.access === 'FULL_ACCESS')
      );
    }

    return user.nickname === 'root';
  }

  @Get()
  async findAll(@Query() filters: CommentFiltersDto, @Req() req: Request): Promise<ApiResponseInterface<CommentWithUser>> {
    try {
      const userId = this.getUserId(req);
      const result = await this.commentsService.findAll(filters, userId);
      return result;
    } catch (error) {
      this.logger.error('Erro ao buscar comentários:', error);
      throw new BadRequestException({
        status: 500,
        message: `Erro ao buscar comentários: ${error.message}`,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<Comment>> {
    try {
      const userId = this.getUserId(req);
      const result = await this.commentsService.findOne(id, userId);
      return result;
    } catch (error) {
      this.logger.error('Erro ao buscar comentário:', error);
      throw new BadRequestException({
        status: 500,
        message: `Erro ao buscar comentário: ${error.message}`,
      });
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request): Promise<ApiResponseInterface<Comment>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new BadRequestException('Usuário não autenticado');
      }

      const result = await this.commentsService.create(createCommentDto, userId);
      return result;
    } catch (error) {
      this.logger.error('Erro ao criar comentário:', error);
      throw new BadRequestException({
        status: 500,
        message: `Erro ao criar comentário: ${error.message}`,
      });
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ): Promise<ApiResponseInterface<Comment>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new BadRequestException('Usuário não autenticado');
      }

      const result = await this.commentsService.update(id, updateCommentDto, userId);
      return result;
    } catch (error) {
      this.logger.error('Erro ao atualizar comentário:', error);
      throw new BadRequestException({
        status: 500,
        message: `Erro ao atualizar comentário: ${error.message}`,
      });
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<void>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new BadRequestException('Usuário não autenticado');
      }

      const isAdmin = this.isAdmin(req);
      const result = await this.commentsService.remove(id, userId, isAdmin);
      return result;
    } catch (error) {
      this.logger.error('Erro ao deletar comentário:', error);
      throw new BadRequestException({
        status: 500,
        message: `Erro ao deletar comentário: ${error.message}`,
      });
    }
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  async likeComment(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new BadRequestException('Usuário não autenticado');
      }

      const result = await this.commentsService.likeComment(id, userId);
      return result;
    } catch (error) {
      this.logger.error('Erro ao dar like no comentário:', error);
      throw new BadRequestException({
        status: 500,
        message: `Erro ao dar like no comentário: ${error.message}`,
      });
    }
  }

  @Post(':id/dislike')
  @UseGuards(AuthGuard)
  async dislikeComment(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new BadRequestException('Usuário não autenticado');
      }

      const result = await this.commentsService.dislikeComment(id, userId);
      return result;
    } catch (error) {
      this.logger.error('Erro ao dar dislike no comentário:', error);
      throw new BadRequestException({
        status: 500,
        message: `Erro ao dar dislike no comentário: ${error.message}`,
      });
    }
  }
}
