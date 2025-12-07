import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Article } from "../database/sequelize/models/article.model";
import { Op } from "sequelize";
import { Events, Games, User, UserGameProcess } from "../database/sequelize/models/index.model";


@Injectable()
export class HighlightsRepository {
    constructor(
        @InjectModel(Article) private readonly articleModel: typeof Article,
        @InjectModel(UserGameProcess) private readonly userGameProcessModel: typeof UserGameProcess,
        @InjectModel(Games) private readonly gamesModel: typeof Games,
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Events) private readonly eventsModel: typeof Events,
    ) { }

    async findArticlesFromLastWeek(): Promise<Article[]> {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return await this.articleModel.findAll({
            where: {
                created_at: {
                    [Op.gte]: oneWeekAgo
                }
            },
            order: [['created_at', 'DESC']],
            limit: 10
        });
    }

    async findTopPlayersByScore(): Promise<any[]> {
        return this.userGameProcessModel.findAll({
            include: [
                {
                    model: Games,
                    attributes: ['name']
                },
                {
                    model: User,
                    attributes: ['nickname'] 
                }
            ],
            attributes: ['lvl_user', 'score'],
            order: [['score', 'DESC']],
            limit: 5
        });
    }

    async findUpcomingEventsThisMonth(): Promise<Events[]> {
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        return await this.eventsModel.findAll({
            where: {
                date_event: {
                    [Op.gte]: now,        
                    [Op.lte]: lastDay      
                }
            },
            order: [['date_event', 'ASC']]
        });
    }
}