import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Comment } from "../../../../infrastructure/database/sequelize/models/comment.model";
import { CreateCommentDto } from "../../../../interface/dtos/comments/create-comment.dto";

export interface ICreateCommentPort {
  execute(createCommentDto: CreateCommentDto, userId: string): Promise<ApiResponseInterface<Comment>>;
}
