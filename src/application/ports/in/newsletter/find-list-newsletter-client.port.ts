import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "../../../../domain/interfaces/newsletter.interface";


export interface IFindListNewsletterClientPort {
    execute(usuario_id: string): Promise<ApiResponseInterface<NewsletterInterface>>;
}

