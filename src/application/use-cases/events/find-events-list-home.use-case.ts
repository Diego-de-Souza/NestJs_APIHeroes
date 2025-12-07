import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Events } from "../../../infrastructure/database/sequelize/models/events.model";
import { EventsRepository } from "../../../infrastructure/repositories/events.repository";


@Injectable()
export class FindEventsListHomeUseCase {
    constructor(
        private readonly eventsRepository: EventsRepository
    ) {}

    async listEventsHome(): Promise<ApiResponseInterface<Events>> {
        try{
            const eventsForHome = await this.eventsRepository.findEventsForHome();
            return {
                status: 200,
                message: 'Eventos para home listados com sucesso.',
                data: eventsForHome
            };
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao listar eventos para home.',
                error: error.message || error,
            };
        }
    }
}