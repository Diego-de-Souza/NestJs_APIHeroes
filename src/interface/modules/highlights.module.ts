import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { HighlightsController } from "../controllers/highlights.controller";
import { HighlightsService } from "src/application/services/highlights.service";
import { FindHighlightsUseCase } from "src/application/use-cases/highlights/find-highlights.use-case";
import { HighlightsRepository } from "src/infrastructure/repositories/highlights.repository";

@Module({
    imports: [
        SequelizeModule.forFeature(models)
    ],
    controllers: [HighlightsController],
    providers: [
        FindHighlightsUseCase,
        HighlightsService,
        HighlightsRepository
    ],
    exports: [HighlightsService]
})
export class HighlightsModule {}