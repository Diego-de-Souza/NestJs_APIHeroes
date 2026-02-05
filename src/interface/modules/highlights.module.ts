import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { HighlightsController } from "../controllers/highlights.controller";
import { FindHighlightsUseCase } from "../../application/use-cases/highlights/find-highlights.use-case";
import { HighlightsRepository } from "../../infrastructure/repositories/highlights.repository";

/**
 * Módulo Highlights – arquitetura Clean/Hexagonal.
 * Port IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
  ],
  controllers: [HighlightsController],
  providers: [
    FindHighlightsUseCase,
    HighlightsRepository,
    { provide: 'IFindHighlightsPort', useClass: FindHighlightsUseCase },
    { provide: 'IHighlightsRepository', useClass: HighlightsRepository },
  ],
  exports: ['IFindHighlightsPort'],
})
export class HighlightsModule {}
