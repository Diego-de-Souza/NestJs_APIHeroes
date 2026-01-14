import { Injectable } from '@nestjs/common';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { Comment } from '../../infrastructure/database/sequelize/models/comment.model';
import { CommentWithUser } from '../../domain/interfaces/comment.interface';
import { CreateCommentUseCase } from '../use-cases/comments/create-comment.use-case';
import { FindCommentsUseCase } from '../use-cases/comments/find-comments.use-case';
import { FindCommentByIdUseCase } from '../use-cases/comments/find-comment-by-id.use-case';
import { UpdateCommentUseCase } from '../use-cases/comments/update-comment.use-case';
import { DeleteCommentUseCase } from '../use-cases/comments/delete-comment.use-case';
import { LikeCommentUseCase } from '../use-cases/comments/like-comment.use-case';
import { DislikeCommentUseCase } from '../use-cases/comments/dislike-comment.use-case';
import { CreateCommentDto } from '../../interface/dtos/comments/create-comment.dto';
import { UpdateCommentDto } from '../../interface/dtos/comments/update-comment.dto';
import { CommentFiltersDto } from '../../interface/dtos/comments/comment-filters.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly findCommentsUseCase: FindCommentsUseCase,
    private readonly findCommentByIdUseCase: FindCommentByIdUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly likeCommentUseCase: LikeCommentUseCase,
    private readonly dislikeCommentUseCase: DislikeCommentUseCase,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number): Promise<ApiResponseInterface<Comment>> {
    return await this.createCommentUseCase.execute(createCommentDto, userId);
  }

  async findAll(filters: CommentFiltersDto, userId?: number): Promise<ApiResponseInterface<CommentWithUser>> {
    return await this.findCommentsUseCase.execute(filters, userId);
  }

  async findOne(id: number, userId?: number): Promise<ApiResponseInterface<Comment>> {
    return await this.findCommentByIdUseCase.execute(id, userId);
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<ApiResponseInterface<Comment>> {
    return await this.updateCommentUseCase.execute(id, updateCommentDto, userId);
  }

  async remove(id: number, userId: number, isAdmin: boolean = false): Promise<ApiResponseInterface<void>> {
    return await this.deleteCommentUseCase.execute(id, userId, isAdmin);
  }

  async likeComment(commentId: number, userId: number): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>> {
    return await this.likeCommentUseCase.execute(commentId, userId);
  }

  async dislikeComment(commentId: number, userId: number): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>> {
    return await this.dislikeCommentUseCase.execute(commentId, userId);
  }
}
