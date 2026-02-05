import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { HttpModule } from "@nestjs/axios";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { ArticlesController } from "../controllers/articles.Controller";
import { AuthModule } from "./auth.module";
import { ArticlesRepository } from "../../infrastructure/repositories/articles.repository";
import { CreateArticleUseCase } from "../../application/use-cases/articles/create-articles.use-case";
import { DeleteArticleUseCase } from "../../application/use-cases/articles/delete-article.use-case";
import { FindAllArticleUseCase } from "../../application/use-cases/articles/find-all-articles.use-case";
import { FindArticleByIdUseCase } from "../../application/use-cases/articles/find-article-by-id.use-case";
import { UpdateArticleUseCase } from "../../application/use-cases/articles/update-article.use-case";
import { FindArticlesForHomepageUseCase } from "../../application/use-cases/articles/find-articles-for-homepage.use-case";
import { AutomaticContentCreateUseCase } from "../../application/use-cases/articles/automatic_content_create.use-case";
import { ImageService } from "../../application/services/image.service";
import { ConverterImageUseCase } from "../../application/use-cases/images/converter-image.use-case";
import { SearchArticlesUseCase } from "../../application/use-cases/articles/search-articles.use-case";
import { SearchSuggestionsUseCase } from "../../application/use-cases/articles/search-suggestions.use-case";
import { CreateClientArticleUseCase } from "../../application/use-cases/articles/create-client-article.use-case";
import { UpdateClientArticleUseCase } from "../../application/use-cases/articles/update-client-article.use-case";
import { FindClientArticleByIdUseCase } from "../../application/use-cases/articles/find-client-article-by-id.use-case";
import { FindClientArticlesByUserIdUseCase } from "../../application/use-cases/articles/find-client-articles-by-user-id.use-case";
import { DeleteClientArticleUseCase } from "../../application/use-cases/articles/delete-client-article.use-case";
import { DeleteManyClientArticlesUseCase } from "../../application/use-cases/articles/delete-many-client-articles.use-case";
import { UserModule } from "./user.module";


@Module({
    imports: [
        SequelizeModule.forFeature(models),
        HttpModule.register({
            timeout: 30000, // 30 segundos timeout global
            maxRedirects: 3
        }),
        AuthModule, 
        UserModule,
    ],
    controllers: [ArticlesController],
    providers: [
        ArticlesRepository,
        CreateArticleUseCase,
        UpdateArticleUseCase,
        FindArticleByIdUseCase,
        FindAllArticleUseCase,
        DeleteArticleUseCase,
        FindArticlesForHomepageUseCase,
        AutomaticContentCreateUseCase,
        ImageService,
        ConverterImageUseCase,
        SearchArticlesUseCase,
        SearchSuggestionsUseCase,
        CreateClientArticleUseCase,
        UpdateClientArticleUseCase,
        FindClientArticleByIdUseCase,
        FindClientArticlesByUserIdUseCase,
        DeleteClientArticleUseCase,
        DeleteManyClientArticlesUseCase,

        //in
        { provide: 'ISearchArticlePort', useClass: SearchArticlesUseCase },
        { provide: 'IGetSearchSuggestionsPort', useClass: SearchSuggestionsUseCase },
        { provide: 'IFindArticlesForHomepagePort', useClass: FindArticlesForHomepageUseCase },
        { provide: 'ICreateArticlePort', useClass: CreateArticleUseCase },
        { provide: 'IUpdateArticlePort', useClass: UpdateArticleUseCase },
        { provide: 'IFindArticleByIdPort', useClass: FindArticleByIdUseCase },
        { provide: 'IFindAllArticlePort', useClass: FindAllArticleUseCase },
        { provide: 'IDeleteArticlePort', useClass: DeleteArticleUseCase },
        { provide: 'IDeleteClientArticlePort', useClass: DeleteClientArticleUseCase },
        { provide: 'IDeleteManyClientArticlePort', useClass: DeleteManyClientArticlesUseCase },
        { provide: 'ICreateClientArticlePort', useClass: CreateClientArticleUseCase },
        { provide: 'IUpdateClientArticlePort', useClass: UpdateClientArticleUseCase },
        { provide: 'IFindClientArticleByIdPort', useClass: FindClientArticleByIdUseCase },
        { provide: 'IFindClientArticlesByUserIdPort', useClass: FindClientArticlesByUserIdUseCase },

        //out
        { provide: 'IArticlePort', useClass: ArticlesRepository },

    ],
    exports: []
})
export class ArticleModule {}