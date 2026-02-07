import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Comment } from "../../../../infrastructure/database/sequelize/models/comment.model";
import { UpdateCommentDto } from "../../../../interface/dtos/comments/update-comment.dto";

export interface IUpdateCommentPort {
  execute(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<ApiResponseInterface<Comment>>;
}
