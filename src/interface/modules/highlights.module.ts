import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { HighlightsController } from "../controllers/highlights.controller";
import { HighlightsService } from "../../application/services/highlights.service";
import { FindHighlightsUseCase } from "../../application/use-cases/highlights/find-highlights.use-case";
import { HighlightsRepository } from "../../infrastructure/repositories/highlights.repository";

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