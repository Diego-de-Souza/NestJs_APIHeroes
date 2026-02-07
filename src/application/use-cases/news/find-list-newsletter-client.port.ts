import { Inject, Injectable } from "@nestjs/common";
import type { IFindListNewsletterClientPort } from "../../ports/in/newsletter/find-list-newsletter-client.port";
import type { INewsletterRepository } from "../../ports/out/newsletter.port";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "../../../domain/interfaces/newsletter.interface";


@Injectable()
export class FindListNewsletterClientUseCase implements IFindListNewsletterClientPort {
    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository
    ){}

    async execute(usuario_id: string): Promise<ApiResponseInterface<NewsletterInterface>> {
        try{
            const newsletters = await this.newsletterRepository.findNewsByUserId(usuario_id);
            return {
                status: 200,
                message: 'Notícias encontradas com sucesso',
                data: newsletters
            };
        }catch(error){
            return { status: 500, message: 'Erro inesperado ao buscar Notícias.', error: error.message || error };
        }
    }
}