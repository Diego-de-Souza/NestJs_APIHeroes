import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Comment } from "src/infrastructure/database/sequelize/models/comment.model";
import { UpdateCommentDto } from "src/interface/dtos/comments/update-comment.dto";

export interface IUpdateCommentPort {
  execute(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<ApiResponseInterface<Comment>>;
}
