import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { CommentWithUser } from "src/domain/interfaces/comment.interface";
import { CommentFiltersDto } from "src/interface/dtos/comments/comment-filters.dto";

export interface IFindCommentsPort {
  execute(filters: CommentFiltersDto, userId?: string): Promise<ApiResponseInterface<CommentWithUser>>;
}
