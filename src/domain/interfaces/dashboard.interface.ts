import { AccessLog } from "../../infrastructure/database/sequelize/models/access-log.model";

export interface AccessByMonth {
    janeiro: number;
    fevereiro: number;
    marco: number;
    abril: number;
    maio: number;
    junho: number;
    julho: number;
    agosto: number;
    setembro: number;
    outubro: number;
    novembro: number;
    dezembro: number;
}

export interface DashboardInterface {
    numberUsersRegistered: number;
    numberArticlesRegistered: number;
    numberAcessesRegistered: AccessLog[];
    numberEventsRegistered: number;
    numberAcessesByMonth: AccessByMonth;
    acessosUsuariosPorMes: AccessByMonth;
}