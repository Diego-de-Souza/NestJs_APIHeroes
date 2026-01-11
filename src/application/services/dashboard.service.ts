import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { FindDashboardUseCase } from "../use-cases/dashboard/find-dashboard.use-case";
import { User } from "src/infrastructure/database/sequelize/models/user.model";
import { DashboardInterface } from "src/domain/interfaces/dashboard.interface";

@Injectable()
export class DashboardService {
    constructor(
        private readonly findDashboardUseCase: FindDashboardUseCase
    ) {}

    async getDashboard(): Promise<ApiResponseInterface<DashboardInterface>> {
        return await this.findDashboardUseCase.getDashboard();
    }
}