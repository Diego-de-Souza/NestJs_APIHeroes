import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { NewsController } from "../../interface/controllers/news.controller";
import { NewsService } from "../../application/services/news.service";
import { NewsRepository } from "../../infrastructure/repositories/news.repository";
import { CreateNewsUseCase } from "../../application/use-cases/news/create-news.use-case";
import { UpdateNewsUseCase } from "../../application/use-cases/news/update-news.use-case";
import { FindNewsByIdUseCase } from "../../application/use-cases/news/find-news-by-id.use-case";
import { FindNewsByUserIdUseCase } from "../../application/use-cases/news/find-news-by-user-id.use-case";
import { DeleteNewsUseCase } from "../../application/use-cases/news/delete-news.use-case";
import { DeleteManyNewsUseCase } from "../../application/use-cases/news/delete-many-news.use-case";
import { AuthModule } from "./auth.module";

@Module({
    imports: [
        SequelizeModule.forFeature(models),
        AuthModule
    ],
    controllers: [NewsController],
    providers: [
        NewsService,
        NewsRepository,
        CreateNewsUseCase,
        UpdateNewsUseCase,
        FindNewsByIdUseCase,
        FindNewsByUserIdUseCase,
        DeleteNewsUseCase,
        DeleteManyNewsUseCase
    ],
    exports: [NewsService]
})
export class NewsModule {}
