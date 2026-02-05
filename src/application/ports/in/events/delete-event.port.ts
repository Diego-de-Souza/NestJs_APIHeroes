import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";

export interface IDeleteEventPort {
  execute(id: string): Promise<ApiResponseInterface<number>>;
}
