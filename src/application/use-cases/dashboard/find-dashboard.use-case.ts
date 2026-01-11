import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { DashboardInterface } from "src/domain/interfaces/dashboard.interface";
import { User } from "src/infrastructure/database/sequelize/models/user.model";
import { DashboardRepository } from "src/infrastructure/repositories/dashboard.repository";

@Injectable()
export class FindDashboardUseCase {
    constructor(
        private readonly dashboardRepository: DashboardRepository
    ) {}

    async getDashboard(): Promise<ApiResponseInterface<DashboardInterface>> {
        try{
            const numberUsersRegistered = await this.dashboardRepository.getNumberUsersRegistered();

            const numberArticlesRegistered = await this.dashboardRepository.getNumberArticlesRegistered();

            const numberAcessesRegistered = await this.dashboardRepository.getNumberAcessesRegistered();

            const numberEventsRegistered = await this.dashboardRepository.getNumberEventsRegistered();

            const numberAcessesByMonth = await this.dashboardRepository.getNumberAcessesByMonth();

            const acessosUsuariosPorMes = await this.dashboardRepository.getUsersRegisteredByMonth();

            const resultData: DashboardInterface = {
                numberUsersRegistered: numberUsersRegistered,
                numberArticlesRegistered: numberArticlesRegistered,
                numberAcessesRegistered: numberAcessesRegistered,
                numberEventsRegistered: numberEventsRegistered,
                numberAcessesByMonth: numberAcessesByMonth,
                acessosUsuariosPorMes: acessosUsuariosPorMes
            };

            return {
                status: HttpStatus.OK,
                message: 'Dashboard encontrado com sucesso',
                data: [resultData]
            };
        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro inesperado ao buscar dashboard',
                error: error.message || error
            };
        }
    }
}