import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from "../../infrastructure/database/sequelize/models/index.model";
import { AuthModule } from "./auth.module";

import { DashboardController } from "../controllers/dashboard.controller";
import { DashboardService } from "../../application/services/dashboard.service";
import { FindDashboardUseCase } from "../../application/use-cases/dashboard/find-dashboard.use-case";
import { DashboardRepository } from "../../infrastructure/repositories/dashboard.repository";

@Module({
    imports: [
        SequelizeModule.forFeature(models),
        AuthModule
    ],
    controllers: [DashboardController],
    providers: [
        DashboardService, 
        FindDashboardUseCase, 
        DashboardRepository
    ]
})
export class DashboardModule {}