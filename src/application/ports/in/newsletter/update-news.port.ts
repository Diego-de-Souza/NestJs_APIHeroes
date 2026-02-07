import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../../infrastructure/database/sequelize/models/news.model";
import { UpdateNewsDto } from "../../../../interface/dtos/news/update-news.dto";

/** Port IN: contrato para atualizar newsletter. */
export interface IUpdateNewsPort {
    execute(id: string, newsDto: UpdateNewsDto, usuario_id: string): Promise<ApiResponseInterface<News>>;
}
