import { Events } from "src/infrastructure/database/sequelize/models/events.model";

/** Port OUT: contrato do repositório de eventos. */
export interface IEventsRepository {
  createRegisterEvent(eventDto: any): Promise<Events>;
  findListOfEvents(): Promise<Events[]>;
  deleteEvent(id: string): Promise<number>;
  findEventById(id: string): Promise<Events>;
  findEventsForHome(): Promise<Events[]>;
}
