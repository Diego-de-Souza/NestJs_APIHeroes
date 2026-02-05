import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";
import { CreateNewsletterDto } from "src/interface/dtos/news/create-newsletter.dto";


export interface ICreateNewsletterClientPort {
    execute(newsDto: CreateNewsletterDto): Promise<ApiResponseInterface<NewsletterInterface>>;
}