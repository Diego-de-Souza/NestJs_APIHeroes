import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Games } from "../database/sequelize/models/games/games.model";
import { UserGameProcess } from "../database/sequelize/models/games/user-game-progress.model";
import type { IGamesRepository } from "../../application/ports/out/games.port";

@Injectable()
export class GamesRepository implements IGamesRepository {
  
    constructor(
        @InjectModel(Games) private readonly gamesModel: typeof Games,
        @InjectModel(UserGameProcess) private readonly userGameProgressModel: typeof UserGameProcess
    ){}

    createGame(gameData: Record<string, unknown>): Promise<Games> {
        return this.gamesModel.create(gameData);
    }

    updateGame(id: string, gameData: Record<string, unknown>): Promise<number> {
        return this.gamesModel.update(gameData, {
            where: {
                id: id
            }
        }).then(([affectedCount]) => affectedCount);
    }

    findGameById(id: string): Promise<Games | null> {
        return this.gamesModel.findByPk(id);
    }

    deleteGame(id: string): Promise<number> {
        return this.gamesModel.destroy({
            where: {
                id: id
            }
        });
    }

    findGameByType(type: string): Promise<Games | null> {
        return this.gamesModel.findOne({
            where: {
                type: type
            },
            attributes: ['id'],
        });
    }

    findOneProcess(userId: string, idGame: string): Promise<UserGameProcess | null> {
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

    update(data: Partial<UserGameProcess>, userId: string, idGame: string): Promise<[number]> {
        return this.userGameProgressModel.update(data, {
            where: {
                user_id: userId,
                game_id: idGame
            }
        });
    }

    findGameByPk(id: string): Promise<Games | null> {
        return this.gamesModel.findByPk(id);
    }

    findAllGames(): Promise<Games[]> {
        return this.gamesModel.findAll();
    }

}