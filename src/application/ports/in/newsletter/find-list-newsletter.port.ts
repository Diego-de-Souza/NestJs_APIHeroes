import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "../../../../domain/interfaces/newsletter.interface";


export interface IFindListNewsletterPort {
    execute(): Promise<ApiResponseInterface<NewsletterInterface>>;
}