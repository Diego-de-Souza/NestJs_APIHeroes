import { HttpStatus, Injectable } from "@nestjs/common";
import { ImageService } from "src/application/services/image.service";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { EventsRepository } from "src/infrastructure/repositories/events.repository";


@Injectable()
export class DeleteEventsUseCase {
    constructor(
        private readonly eventsRepository: EventsRepository,
        private readonly imageService: ImageService
    ){}

    async deleteEvent(id: number): Promise<ApiResponseInterface<number>>{
        try{
            const eventDeleted = await this.eventsRepository.findEventById(id);
            
            if(!eventDeleted){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Evento não encontrado."
                }
            }

            await this.eventsRepository.deleteEvent(id);

            if(eventDeleted.url_image){
                await this.imageService.deleteImage(eventDeleted.url_image);
            }
            
            return {
                status: HttpStatus.OK,
                message: "Eventos deletados com sucesso."
            }
        }catch(error){
            throw new Error('Erro inesperado ao deletar eventos: ' + (error.message || error));
        }
    }
}