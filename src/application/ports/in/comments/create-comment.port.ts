import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Comment } from "src/infrastructure/database/sequelize/models/comment.model";
import { CreateCommentDto } from "src/interface/dtos/comments/create-comment.dto";

export interface ICreateCommentPort {
  execute(createCommentDto: CreateCommentDto, userId: string): Promise<ApiResponseInterface<Comment>>;
}
