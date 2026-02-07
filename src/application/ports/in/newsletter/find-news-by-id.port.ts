import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../../infrastructure/database/sequelize/models/news.model";

/** Port IN: contrato para buscar newsletter por id e usuário. */
export interface IFindNewsByIdPort {
    execute(id: string, usuario_id: string): Promise<ApiResponseInterface<News>>;
}
