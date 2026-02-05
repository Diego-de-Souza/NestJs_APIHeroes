import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";


export interface IFindListNewsletterPort {
    execute(): Promise<ApiResponseInterface<NewsletterInterface>>;
}