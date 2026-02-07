import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";

export interface ILikeCommentPort {
  execute(commentId: string, userId: string): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>>;
}
