import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Events } from "../../../../infrastructure/database/sequelize/models/events.model";

export interface IFindEventsPort {
  execute(): Promise<ApiResponseInterface<Events>>;
}
