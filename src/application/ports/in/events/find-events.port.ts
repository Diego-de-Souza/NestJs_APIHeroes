import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Events } from "src/infrastructure/database/sequelize/models/events.model";

export interface IFindEventsPort {
  execute(): Promise<ApiResponseInterface<Events>>;
}
