import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "../../../../domain/interfaces/newsletter.interface";
import { CreateNewsletterDto } from "../../../../interface/dtos/news/create-newsletter.dto";


export interface ICreateNewsletterClientPort {
    execute(newsDto: CreateNewsletterDto): Promise<ApiResponseInterface<NewsletterInterface>>;
}