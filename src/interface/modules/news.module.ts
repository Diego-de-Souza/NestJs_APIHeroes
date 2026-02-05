import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { NewsController } from "../../interface/controllers/news.controller";
import { NewsRepository } from "../../infrastructure/repositories/news.repository";
import { CreateNewsletterUseCase } from "../../application/use-cases/news/create-newsletter.use-case";
import { FindNewsByUserIdUseCase } from "../../application/use-cases/news/find-news-by-user-id.use-case";
import { FindNewsByIdUseCase } from "../../application/use-cases/news/find-news-by-id.use-case";
import { UpdateNewsUseCase } from "../../application/use-cases/news/update-news.use-case";
import { DeleteNewsUseCase } from "../../application/use-cases/news/delete-news.use-case";
import { DeleteManyNewsUseCase } from "../../application/use-cases/news/delete-many-news.use-case";
import { AuthModule } from "./auth.module";
import { FindListNewsletterUseCase } from "src/application/use-cases/news/find-list-newsletter.use-case";
import { ImageService } from "../../application/services/image.service";
import { ConverterImageUseCase } from "../../application/use-cases/images/converter-image.use-case";
import { FindListNewsletterClientUseCase } from "src/application/use-cases/news/find-list-newsletter-client.port";

/**
 * Módulo News – arquitetura híbrida Clean/Hexagonal.
 * - Ports IN (application/ports/in): contratos usados pelo controller; implementados pelos use cases.
 * - Ports OUT (application/ports/out): contratos usados pelos use cases; implementados pelo repository.
 */
@Module({
    imports: [
        SequelizeModule.forFeature(models),
        AuthModule
    ],
    controllers: [NewsController],
    providers: [
        ImageService,
        ConverterImageUseCase,
        NewsRepository,
        CreateNewsletterUseCase,
        FindNewsByUserIdUseCase,
        FindNewsByIdUseCase,
        UpdateNewsUseCase,
        DeleteNewsUseCase,
        DeleteManyNewsUseCase,
        FindListNewsletterUseCase,
        FindListNewsletterClientUseCase,
        // Ports IN: controller → use case
        { provide: 'ICreateNewsletterPort', useClass: CreateNewsletterUseCase },
        { provide: 'IGetListNewsletterPort', useClass: FindNewsByUserIdUseCase },
        { provide: 'IFindNewsByIdPort', useClass: FindNewsByIdUseCase },
        { provide: 'IUpdateNewsPort', useClass: UpdateNewsUseCase },
        { provide: 'IDeleteNewsPort', useClass: DeleteNewsUseCase },
        { provide: 'IDeleteManyNewsPort', useClass: DeleteManyNewsUseCase },
        { provide: 'IFindListNewsletterPort', useClass: FindListNewsletterUseCase },
        { provide: 'IFindListNewsletterClientPort', useClass: FindListNewsletterClientUseCase },
        // Port OUT: use case → repository
        { provide: 'INewsletterRepository', useClass: NewsRepository },
    ]
})
export class NewsModule {}
