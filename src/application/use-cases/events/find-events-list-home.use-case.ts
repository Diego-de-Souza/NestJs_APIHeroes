import { Inject, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Events } from "../../../infrastructure/database/sequelize/models/events.model";
import type { IEventsRepository } from "../../../application/ports/out/events.port";
import type { IFindEventsListHomePort } from "../../../application/ports/in/events/find-events-list-home.port";

@Injectable()
export class FindEventsListHomeUseCase implements IFindEventsListHomePort {
    constructor(
        @Inject('IEventsRepository') private readonly eventsRepository: IEventsRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<Events>> {
        try{
            const eventsForHome = await this.eventsRepository.findEventsForHome() as Events[];
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