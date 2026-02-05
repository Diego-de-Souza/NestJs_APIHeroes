import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { NewsletterInterface } from "src/domain/interfaces/newsletter.interface";

/** Port IN: contrato para listar newsletters por usuário. */
export interface IGetListNewsletterPort {
    execute(): Promise<ApiResponseInterface<NewsletterInterface>>;
}
