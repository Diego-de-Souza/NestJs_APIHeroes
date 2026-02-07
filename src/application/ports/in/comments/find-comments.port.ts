import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { CommentWithUser } from "../../../../domain/interfaces/comment.interface";
import { CommentFiltersDto } from "../../../../interface/dtos/comments/comment-filters.dto";

export interface IFindCommentsPort {
  execute(filters: CommentFiltersDto, userId?: string): Promise<ApiResponseInterface<CommentWithUser>>;
}
