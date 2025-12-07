import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { ArticlesController } from "../../interface/controllers/articles.Controller";
import { ArticlesService } from "../../application/services/articles.service";
import { ArticlesRepository } from "../../infrastructure/repositories/articles.repository";
import { CreateArticleUseCase } from "../../application/use-cases/articles/create-articles.use-case";
import { DeleteArticleUseCase } from "../../application/use-cases/articles/delete-article.use-case";
import { FindAllArticleUseCase } from "../../application/use-cases/articles/find-all-articles.use-case";
import { FindArticleByIdUseCase } from "../../application/use-cases/articles/find-article-by-id.use-case";
import { UpdateArticleUseCase } from "../../application/use-cases/articles/update-article.use-case";
import { FindArticlesForHomepageUseCase } from "../../application/use-cases/articles/find-articles-for-homepage.use-case";
import { ImageService } from "../../application/services/image.service";
import { ConverterImageUseCase } from "../../application/use-cases/images/converter-image.use-case";

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
        ArticlesRepository,
        FindArticlesForHomepageUseCase,
        ImageService,
        ConverterImageUseCase
    ],
    exports: [ArticlesService]
})
export class ArticleModule {}