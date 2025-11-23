import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { ArticlesController } from "src/interface/controllers/articles.Controller";
import { ArticlesService } from "src/application/services/articles.service";
import { ArticlesRepository } from "src/infrastructure/repositories/articles.repository";
import { CreateArticleUseCase } from "src/application/use-cases/articles/create-articles.use-case";
import { DeleteArticleUseCase } from "src/application/use-cases/articles/delete-article.use-case";
import { FindAllArticleUseCase } from "src/application/use-cases/articles/find-all-articles.use-case";
import { FindArticleByIdUseCase } from "src/application/use-cases/articles/find-article-by-id.use-case";
import { UpdateArticleUseCase } from "src/application/use-cases/articles/update-article.use-case";

@Module({
    imports: [
        SequelizeModule.forFeature(models)
    ],
    controllers: [ArticlesController],
    providers: [
        ArticlesService,
        CreateArticleUseCase,
        UpdateArticleUseCase,
        FindArticleByIdUseCase,
        FindAllArticleUseCase,
        DeleteArticleUseCase,
        ArticlesRepository
    ],
    exports: [ArticlesService]
})
export class ArticleModule {}