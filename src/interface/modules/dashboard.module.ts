import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from "../../infrastructure/database/sequelize/models/index.model";
import { AuthModule } from "./auth.module";
import { DashboardController } from "../controllers/dashboard.controller";
import { FindDashboardUseCase } from "../../application/use-cases/dashboard/find-dashboard.use-case";
import { DashboardRepository } from "../../infrastructure/repositories/dashboard.repository";

/**
 * Módulo Dashboard – arquitetura Clean/Hexagonal.
 * Port IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [
    DashboardRepository,
    FindDashboardUseCase,
    { provide: 'IFindDashboardPort', useClass: FindDashboardUseCase },
    { provide: 'IDashboardRepository', useClass: DashboardRepository },
  ],
})
export class DashboardModule {}
