import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../infrastructure/database/sequelize/models/news.model";
import { NewsRepository } from "../../../infrastructure/repositories/news.repository";
import { CreateNewsDto } from "../../../interface/dtos/news/create-news.dto";
import { RoleEnum, getRoleArtFromString } from "../../../shared/enums/role.enum";

@Injectable()
export class CreateNewsUseCase {
    private readonly logger = new Logger(CreateNewsUseCase.name);

    constructor(
        private readonly newsRepository: NewsRepository
    ){}

    async createNews(newsDto: CreateNewsDto): Promise<ApiResponseInterface<News>>{
        try {
            let roleArt = newsDto.role_art || RoleEnum.CLIENT;
            
            if (!newsDto.role_art) {
                const roleUser = await this.newsRepository.findRoleByUserId(newsDto.usuario_id);
                if (roleUser && roleUser.role) {
                    roleArt = getRoleArtFromString(roleUser.role);
                }
            }

            const newsToSave = {
                ...newsDto,
                role_art: roleArt
            };

            const news = await this.newsRepository.createNews(newsToSave);

            return {
                status: HttpStatus.CREATED,
                message: "Notícia criada com sucesso.",
                dataUnit: news
            };
        } catch (error) {
            this.logger.error('Erro ao criar notícia:', error);
            throw error;
        }
    }
}
