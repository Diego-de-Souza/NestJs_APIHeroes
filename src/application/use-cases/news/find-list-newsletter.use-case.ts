import { Inject, Injectable } from "@nestjs/common";
import type { IFindListNewsletterPort } from "src/application/ports/in/newsletter/find-list-newsletter.port";
import type { INewsletterRepository } from "src/application/ports/out/newsletter.port";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";


@Injectable()
export class FindListNewsletterUseCase implements IFindListNewsletterPort {
    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository
    ){}

    async execute(): Promise<ApiResponseInterface<NewsletterInterface>> {
        try {
            const newsletter = await this.newsletterRepository.findListNewsletter();

            console.log('newsletter', newsletter);
            return {
                status: 200,
                message: 'Notícias encontradas com sucesso.',
                data: newsletter
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Erro inesperado ao buscar notícias.',
                error: error.message || error
            }
        }
    }
}