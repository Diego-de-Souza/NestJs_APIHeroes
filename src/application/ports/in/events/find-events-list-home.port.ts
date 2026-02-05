import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Events } from "src/infrastructure/database/sequelize/models/events.model";

export interface IFindEventsListHomePort {
  execute(): Promise<ApiResponseInterface<Events>>;
}
