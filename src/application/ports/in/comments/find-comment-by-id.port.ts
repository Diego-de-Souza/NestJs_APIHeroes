import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Comment } from "../../../../infrastructure/database/sequelize/models/comment.model";

export interface IFindCommentByIdPort {
  execute(id: string, userId?: string): Promise<ApiResponseInterface<Comment>>;
}
