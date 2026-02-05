import { Inject, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Events } from "../../../infrastructure/database/sequelize/models/index.model";
import type { IEventsRepository } from "../../../application/ports/out/events.port";
import type { IFindEventsPort } from "../../../application/ports/in/events/find-events.port";

@Injectable()
export class FindEventsUseCase implements IFindEventsPort {
    constructor(
        @Inject('IEventsRepository') private readonly eventsRepository: IEventsRepository
    ){}

    async execute(): Promise<ApiResponseInterface<Events>>{
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