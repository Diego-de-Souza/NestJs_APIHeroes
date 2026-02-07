import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";

export interface IDeleteEventPort {
  execute(id: string): Promise<ApiResponseInterface<number>>;
}
