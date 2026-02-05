import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IEventsRepository } from "../../../application/ports/out/events.port";
import type { IDeleteEventPort } from "../../../application/ports/in/events/delete-event.port";

@Injectable()
export class DeleteEventsUseCase implements IDeleteEventPort {
    constructor(
        @Inject('IEventsRepository') private readonly eventsRepository: IEventsRepository,
        private readonly imageService: ImageService
    ){}

    async execute(id: string): Promise<ApiResponseInterface<number>>{
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