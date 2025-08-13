import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Games } from "../database/sequelize/models/games/games.model";
import { UserGameProgress } from "../database/sequelize/models/games/user-game-progress.model";

@Injectable()
export class GamesRepository {
  
    constructor(
        @InjectModel(Games) private readonly gamesModel: typeof Games,
        @InjectModel(UserGameProgress) private readonly userGameProgressModel: typeof UserGameProgress
    ){}

    findGameByType(type: string): Promise<Games | null> {
        return this.gamesModel.findOne({
            where: {
                type: type
            },
            attributes: ['id'],
        });
    }

    findOneProcess(userId: number, idGame: number): Promise<UserGameProgress | null> {
        return this.userGameProgressModel.findOne({
            where: {
                user_id: userId,
                game_id: idGame
            }
        });
    }
}