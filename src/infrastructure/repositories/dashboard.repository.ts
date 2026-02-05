import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { AccessLog, Events, User } from "../database/sequelize/models/index.model";
import { Article } from "../database/sequelize/models/article.model";
import { AccessByMonth } from "../../domain/interfaces/dashboard.interface";
import type { IDashboardRepository } from "../../application/ports/out/dashboard.port";

@Injectable()
export class DashboardRepository implements IDashboardRepository {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Article) private readonly articleModel: typeof Article,
        @InjectModel(AccessLog) private readonly accessLogModel: typeof AccessLog,
        @InjectModel(Events) private readonly eventsModel: typeof Events,
    ) {}

    async getNumberUsersRegistered(): Promise<number> {
        return await this.userModel.count();
    }

    async getNumberArticlesRegistered(): Promise<number> {
        return await this.articleModel.count();
    }

    async getNumberAcessesRegistered(): Promise<AccessLog[]> {
        return await this.accessLogModel.findAll();
    }

    async getNumberEventsRegistered(): Promise<number> {
        return await this.eventsModel.count();
    }

    async getNumberAcessesByMonth(): Promise<AccessByMonth> {
        const currentYear = new Date().getFullYear();
        
        // Busca todos os acessos do ano atual
        const allAccesses = await this.accessLogModel.findAll({
            where: {
                timestamp: {
                    [Op.gte]: new Date(currentYear, 0, 1), // 1º de janeiro do ano atual
                    [Op.lt]: new Date(currentYear + 1, 0, 1) // 1º de janeiro do próximo ano
                }
            },
            attributes: ['timestamp']
        });

        // Inicializa todos os meses com 0
        const result: AccessByMonth = {
            janeiro: 0,
            fevereiro: 0,
            marco: 0,
            abril: 0,
            maio: 0,
            junho: 0,
            julho: 0,
            agosto: 0,
            setembro: 0,
            outubro: 0,
            novembro: 0,
            dezembro: 0
        };

        // Mapeia os meses (0-11 em JavaScript, 1-12 no banco)
        const monthMap: { [key: number]: keyof AccessByMonth } = {
            0: 'janeiro',
            1: 'fevereiro',
            2: 'marco',
            3: 'abril',
            4: 'maio',
            5: 'junho',
            6: 'julho',
            7: 'agosto',
            8: 'setembro',
            9: 'outubro',
            10: 'novembro',
            11: 'dezembro'
        };

        // Agrupa por mês
        allAccesses.forEach((access) => {
            const timestamp = (access as any).timestamp || access.get('timestamp');
            if (timestamp) {
                const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
                const month = date.getMonth(); // 0-11
                if (monthMap[month] !== undefined) {
                    result[monthMap[month]]++;
                }
            }
        });

        return result;
    }

    async getUsersRegisteredByMonth(): Promise<AccessByMonth> {
        const currentYear = new Date().getFullYear();
        
        // Busca todos os usuários cadastrados do ano atual
        const allUsers = await this.userModel.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(currentYear, 0, 1), // 1º de janeiro do ano atual
                    [Op.lt]: new Date(currentYear + 1, 0, 1) // 1º de janeiro do próximo ano
                }
            },
            attributes: ['createdAt']
        });

        // Inicializa todos os meses com 0
        const result: AccessByMonth = {
            janeiro: 0,
            fevereiro: 0,
            marco: 0,
            abril: 0,
            maio: 0,
            junho: 0,
            julho: 0,
            agosto: 0,
            setembro: 0,
            outubro: 0,
            novembro: 0,
            dezembro: 0
        };

        // Mapeia os meses (0-11 em JavaScript)
        const monthMap: { [key: number]: keyof AccessByMonth } = {
            0: 'janeiro',
            1: 'fevereiro',
            2: 'marco',
            3: 'abril',
            4: 'maio',
            5: 'junho',
            6: 'julho',
            7: 'agosto',
            8: 'setembro',
            9: 'outubro',
            10: 'novembro',
            11: 'dezembro'
        };

        // Agrupa por mês
        allUsers.forEach((user) => {
            const createdAt = (user as any).createdAt || user.get('createdAt');
            if (createdAt) {
                const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
                const month = date.getMonth(); // 0-11
                if (monthMap[month] !== undefined) {
                    result[monthMap[month]]++;
                }
            }
        });

        return result;
    }
}   