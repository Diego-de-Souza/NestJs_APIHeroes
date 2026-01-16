import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { NewsRepository } from "../../../infrastructure/repositories/news.repository";

@Injectable()
export class DeleteManyNewsUseCase {
    private readonly logger = new Logger(DeleteManyNewsUseCase.name);

    constructor(
        private readonly newsRepository: NewsRepository
    ){}

    async deleteManyNews(ids: number[], usuario_id: number): Promise<ApiResponseInterface<number>>{
        try {
            if(!ids || ids.length === 0){
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Nenhum ID fornecido."
                };
            }

            const deletedCount = await this.newsRepository.deleteManyNews(ids, usuario_id);

            return {
                status: HttpStatus.OK,
                message: `Notícias excluídas com sucesso. ${deletedCount} notícia(s) removida(s).`,
                dataUnit: deletedCount
            };
        } catch (error) {
            this.logger.error('Erro ao excluir notícias:', error);
            throw error;
        }
    }
}
