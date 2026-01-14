import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentsController } from '../controllers/comments.controller';
import { CommentsService } from '../../application/services/comments.service';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { CreateCommentUseCase } from '../../application/use-cases/comments/create-comment.use-case';
import { FindCommentsUseCase } from '../../application/use-cases/comments/find-comments.use-case';
import { FindCommentByIdUseCase } from '../../application/use-cases/comments/find-comment-by-id.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/comments/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/comments/delete-comment.use-case';
import { LikeCommentUseCase } from '../../application/use-cases/comments/like-comment.use-case';
import { DislikeCommentUseCase } from '../../application/use-cases/comments/dislike-comment.use-case';
import { Comment, CommentLike, Article, User } from '../../infrastructure/database/sequelize/models/index.model';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, CommentLike, Article, User]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CreateCommentUseCase,
    FindCommentsUseCase,
    FindCommentByIdUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    LikeCommentUseCase,
    DislikeCommentUseCase,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
