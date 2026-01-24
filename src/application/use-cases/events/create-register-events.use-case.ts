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
            let imageUploadResult: string;
            
            // Valida se a imagem foi fornecida
            if (!eventDto.image) {
                return {
                    status: 400,
                    message: 'A imagem do evento é obrigatória.',
                };
            }
            
            // Tenta fazer upload da imagem
            try {
                imageUploadResult = await this.imageService.saveImageBase64(eventDto.image, eventDto.image_name, 'events');
                
                if (!imageUploadResult || imageUploadResult.trim() === '') {
                    return {
                        status: 400,
                        message: 'Falha ao salvar a imagem do evento. URL da imagem não foi gerada.',
                    };
                }
            } catch (imageError) {
                return {
                    status: 400,
                    message: 'Erro ao fazer upload da imagem do evento.',
                    error: imageError.message || imageError,
                };
            }

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