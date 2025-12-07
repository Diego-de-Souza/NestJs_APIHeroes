import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Games } from "../database/sequelize/models/games/games.model";
import { UserGameProcess } from "../database/sequelize/models/games/user-game-progress.model";

@Injectable()
export class GamesRepository {
  
    constructor(
        @InjectModel(Games) private readonly gamesModel: typeof Games,
        @InjectModel(UserGameProcess) private readonly userGameProgressModel: typeof UserGameProcess
    ){}

    findGameByType(type: string): Promise<Games | null> {
        return this.gamesModel.findOne({
            where: {
                type: type
            },
            attributes: ['id'],
        });
    }

    findOneProcess(userId: number, idGame: number): Promise<UserGameProcess | null> {
        return this.userGameProgressModel.findOne({
            where: {
                user_id: userId,
                game_id: idGame
            }
        });
    }

    create(data: Partial<UserGameProcess>): Promise<UserGameProcess> {
        return this.userGameProgressModel.create(data);
    }

    update(data: Partial<UserGameProcess>, userId: number, idGame: number): Promise<[number]> {
        return this.userGameProgressModel.update(data, {
            where: {
                user_id: userId,
                game_id: idGame
            }
        });
    }

    findGameByPk(id: number): Promise<Games | null> {
        return this.gamesModel.findByPk(id);
    }

}