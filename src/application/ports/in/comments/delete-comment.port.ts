import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";

export interface IDeleteCommentPort {
  execute(id: string, userId: string, isAdmin?: boolean): Promise<ApiResponseInterface<void>>;
}
