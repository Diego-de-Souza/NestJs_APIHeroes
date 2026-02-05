import { Inject, Injectable, Logger } from "@nestjs/common";
import type { ICreateNewsletterPort } from "src/application/ports/in/newsletter/create-newsletter.port";
import type { INewsletterRepository } from "src/application/ports/out/newsletter.port";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";
import { CreateNewsletterDto } from "src/interface/dtos/news/create-newsletter.dto";
import { ImageService } from "../../services/image.service";

@Injectable()
export class CreateNewsletterUseCase implements ICreateNewsletterPort {
    private readonly logger = new Logger(CreateNewsletterUseCase.name);

    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository,
        private readonly imageService: ImageService
    ) {}

    async execute(newsletterDto: CreateNewsletterDto): Promise<ApiResponseInterface<NewsletterInterface>> {
        try {
            if (newsletterDto.image?.startsWith('data:image')) {
                try {
                    const imageUrl = await this.imageService.saveImageBase64(
                        newsletterDto.image,
                        'newsletter',
                        'newsletter'
                    );
                    (newsletterDto as unknown as Record<string, unknown>).image = imageUrl;
                } catch (error) {
                    this.logger.error('Erro ao salvar imagem da newsletter:', error);
                    return {
                        status: 500,
                        message: 'Erro ao processar imagem.',
                        error: (error as Error).message,
                    };
                }
            }

            const newsletter = await this.newsletterRepository.createNews(newsletterDto);
            return {
                status: 201,
                message: 'Notícia criada com sucesso.',
                dataUnit: newsletter,
            };
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao criar Notícia.',
                error: error.message || error,
            };
        }
    }
}