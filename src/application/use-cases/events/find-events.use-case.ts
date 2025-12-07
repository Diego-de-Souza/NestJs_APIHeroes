import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Events } from "../../../infrastructure/database/sequelize/models/index.model";
import { EventsRepository } from "../../../infrastructure/repositories/events.repository";


@Injectable()
export class FindEventsUseCase {
    constructor(
        private readonly eventsRepository: EventsRepository
    ){}

    async findListOfEvents(): Promise<ApiResponseInterface<Events>>{
        try{
            const events = await this.eventsRepository.findListOfEvents();

            return {
                status: 200,
                message: "Eventos buscados com sucesso.",
                data: events
            }
        }catch(error){
            throw new Error('Erro inesperado ao buscar eventos: ' + (error.message || error));
        }
    }
}