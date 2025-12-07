import { Injectable } from "@nestjs/common";
import { FindEventsUseCase } from "../use-cases/events/find-events.use-case";
import { DeleteEventsUseCase } from "../use-cases/events/delete-event.use-case";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateRegisterEventsUseCase } from "../use-cases/events/create-register-events.use-case";
import { FindEventsListHomeUseCase } from "../use-cases/events/find-events-list-home.use-case";


@Injectable()
export class EventsService{
    constructor(
        private readonly findEventsUseCase: FindEventsUseCase,
        private readonly deleteEventsUseCase: DeleteEventsUseCase,
        private readonly createRegisterEventsUseCase: CreateRegisterEventsUseCase,
        private readonly findEventsListHomeUseCase: FindEventsListHomeUseCase,
    ){}

    async createRegisterEvent(eventDto: any): Promise<ApiResponseInterface<string>> {
        return await this.createRegisterEventsUseCase.createEvent(eventDto);
    }

    async getEvents(){
        return await this.findEventsUseCase.findListOfEvents();
    }

    async deleteEvent(id: number): Promise<ApiResponseInterface<number>> {
        return await this.deleteEventsUseCase.deleteEvent(id);
    }

    async listEventsHome(): Promise<ApiResponseInterface<any>> {
        return await this.findEventsListHomeUseCase.listEventsHome();
    }
}