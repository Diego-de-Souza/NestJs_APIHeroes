import { Injectable } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { EventsRepository } from "../../../infrastructure/repositories/events.repository";


@Injectable()
export class CreateRegisterEventsUseCase {
    constructor(
        private readonly eventsRepository: EventsRepository,
        private readonly imageService: ImageService
    ) {}

    async createEvent(eventDto: any): Promise<ApiResponseInterface<string>> {
        try{
            const imageUploadResult = await this.imageService.saveImageBase64(eventDto.image, eventDto.image_name, 'events');

            let eventData = {
                ...eventDto,
                url_image: imageUploadResult,
            }
            const event = await this.eventsRepository.createRegisterEvent(eventData);

            return {
                status: 201,
                message: 'Evento criado com sucesso.',
                dataUnit: `Evento com ID ${event.id} criado.`,
            };
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao criar evento.',
                error: error.message || error,
            };
        }
    }
}