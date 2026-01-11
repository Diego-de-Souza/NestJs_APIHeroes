import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { FindDashboardUseCase } from "../use-cases/dashboard/find-dashboard.use-case";
import { DashboardInterface } from "../../domain/interfaces/dashboard.interface";

@Injectable()
export class DashboardService {
    constructor(
        private readonly findDashboardUseCase: FindDashboardUseCase
    ) {}

    async getDashboard(): Promise<ApiResponseInterface<DashboardInterface>> {
        return await this.findDashboardUseCase.getDashboard();
    }
}