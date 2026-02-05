import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Comment } from "src/infrastructure/database/sequelize/models/comment.model";

export interface IFindCommentByIdPort {
  execute(id: string, userId?: string): Promise<ApiResponseInterface<Comment>>;
}
