import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Events } from "../database/sequelize/models/events.model";
import type { IEventsRepository } from "../../application/ports/out/events.port";

@Injectable()
export class EventsRepository implements IEventsRepository {
    constructor(
        @InjectModel(Events) private readonly eventsModel: typeof Events
    ){}

    async createRegisterEvent(eventDto: any): Promise<Events> {
        return await this.eventsModel.create(eventDto);
    }

    async findListOfEvents(): Promise<Events[]> {
        return await this.eventsModel.findAll();
    }

    async deleteEvent(id: string): Promise<number> {
        return await this.eventsModel.destroy({where: {id}});
    }

    async findEventById(id: string): Promise<Events> {
        return await this.eventsModel.findByPk(id);
    }

    async findEventsForHome(): Promise<Events[]> {
        return await this.eventsModel.findAll({
            limit: 6,
            order: [['created_at', 'DESC']]
        });
    }
}