import { Games } from '../../../infrastructure/database/sequelize/models/games/games.model';
import { UserGameProcess } from '../../../infrastructure/database/sequelize/models/games/user-game-progress.model';

/** Port OUT: contrato do repositório de jogos. UseCase → Port → Repository. */
export interface IGamesRepository {
  createGame(gameData: Record<string, unknown>): Promise<Games>;
  updateGame(id: string, gameData: Record<string, unknown>): Promise<number>;
  findGameById(id: string): Promise<Games | null>;
  deleteGame(id: string): Promise<number>;
  findGameByType(type: string): Promise<Games | null>;
  findOneProcess(userId: string, idGame: string): Promise<UserGameProcess | null>;
  create(data: Partial<UserGameProcess>): Promise<UserGameProcess>;
  update(data: Partial<UserGameProcess>, userId: string, idGame: string): Promise<[number]>;
  findGameByPk(id: string): Promise<Games | null>;
  findAllGames(): Promise<Games[]>;
}
