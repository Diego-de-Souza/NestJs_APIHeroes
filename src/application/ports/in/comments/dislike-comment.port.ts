import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";

export interface IDislikeCommentPort {
  execute(commentId: string, userId: string): Promise<ApiResponseInterface<{ likes: number; dislikes: number }>>;
}
