import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DashboardService } from "src/application/services/dashboard.service";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { User } from "src/infrastructure/database/sequelize/models/user.model";
import { AuthGuard } from "../guards/auth.guard";
import { DashboardInterface } from "src/domain/interfaces/dashboard.interface";


@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiTags('Dashboard')
    @ApiOperation({ summary: 'Buscar dashboard' })
    @ApiResponse({ status: 200, description: 'Dashboard encontrado com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro inesperado ao buscar dashboard' })
    async getDashboard(): Promise<ApiResponseInterface<DashboardInterface>> {
        try {
            const result = await this.dashboardService.getDashboard();
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro inesperado ao buscar dashboard.',
                error: error.message || error,
            };
        }
    }
}