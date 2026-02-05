import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";

export interface ICreateEventPort {
  execute(eventDto: any): Promise<ApiResponseInterface<string>>;
}
