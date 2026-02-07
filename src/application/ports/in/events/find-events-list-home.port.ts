import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Events } from "../../../../infrastructure/database/sequelize/models/events.model";

export interface IFindEventsListHomePort {
  execute(): Promise<ApiResponseInterface<Events>>;
}
