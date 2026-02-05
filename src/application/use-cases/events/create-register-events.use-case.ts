import { Inject, Injectable } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IEventsRepository } from "../../../application/ports/out/events.port";
import type { ICreateEventPort } from "../../../application/ports/in/events/create-event.port";

@Injectable()
export class CreateRegisterEventsUseCase implements ICreateEventPort {
    constructor(
        @Inject('IEventsRepository') private readonly eventsRepository: IEventsRepository,
        private readonly imageService: ImageService
    ) {}

    async execute(eventDto: any): Promise<ApiResponseInterface<string>> {
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
            const event = await this.eventsRepository.createRegisterEvent(eventData as any);

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