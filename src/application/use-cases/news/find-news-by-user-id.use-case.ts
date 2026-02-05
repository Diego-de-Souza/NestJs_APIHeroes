import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { INewsletterRepository } from "src/application/ports/out/newsletter.port";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";
import type { IGetListNewsletterPort } from "src/application/ports/in/newsletter/get-list-newsletter.port";

@Injectable()
export class FindNewsByUserIdUseCase implements IGetListNewsletterPort{
    private readonly logger = new Logger(FindNewsByUserIdUseCase.name);

    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository
    ){}

    async execute(): Promise<ApiResponseInterface<NewsletterInterface>>{
        try {
            const news = await this.newsletterRepository.findListNewsletter();

            console.log('news errado', news);
            return {
                status: HttpStatus.OK,
                message: "Notícias encontradas com sucesso.",
                data: news
            };
        } catch (error) {
            this.logger.error('Erro ao buscar notícias:', error);
            throw error;
        }
    }
}
