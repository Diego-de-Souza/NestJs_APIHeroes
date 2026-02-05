import { Controller, Get, UseGuards, Inject } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { AuthGuard } from "../guards/auth.guard";
import { DashboardInterface } from "../../domain/interfaces/dashboard.interface";
import type { IFindDashboardPort } from "../../application/ports/in/dashboard/find-dashboard.port";

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('IFindDashboardPort') private readonly findDashboardPort: IFindDashboardPort
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiTags('Dashboard')
  @ApiOperation({ summary: 'Buscar dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard encontrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro inesperado ao buscar dashboard' })
  async getDashboard(): Promise<ApiResponseInterface<DashboardInterface>> {
    try {
      return await this.findDashboardPort.execute();
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar dashboard.',
        error: (err?.message ?? String(error)),
      };
    }
  }
}
