import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";


export interface IFindListNewsletterClientPort {
    execute(usuario_id: string): Promise<ApiResponseInterface<NewsletterInterface>>;
}

