import { CreateNewsletterDto } from "src/interface/dtos/news/create-newsletter.dto";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";

/** Port IN: contrato para criação de newsletter. Controller → Port → UseCase. */
export interface ICreateNewsletterPort {
    execute(newsletterDto: CreateNewsletterDto): Promise<ApiResponseInterface<NewsletterInterface>>;
}
