import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { DashboardInterface } from "../../../domain/interfaces/dashboard.interface";
import type { IDashboardRepository } from "../../ports/out/dashboard.port";
import type { IFindDashboardPort } from "../../ports/in/dashboard/find-dashboard.port";

@Injectable()
export class FindDashboardUseCase implements IFindDashboardPort {
    constructor(
        @Inject('IDashboardRepository') private readonly dashboardRepository: IDashboardRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<DashboardInterface>> {
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
        } catch (error: unknown) {
            const err = error as Error;
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro inesperado ao buscar dashboard',
                error: (err?.message ?? String(error)),
            };
        }
    }
}