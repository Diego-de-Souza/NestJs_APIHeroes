import { CreateDadosHeroisDto } from '../../../interface/dtos/dados-herois/create-dados-herois.dto';
import { UpdateDadosHeroisDto } from '../../../interface/dtos/dados-herois/update-dados-herois.dto';
import { Heroes } from '../../../infrastructure/database/sequelize/models/heroes.model';

/** Port OUT: contrato do repositório de heróis. UseCase → Port → Repository. */
export interface IHeroesRepository {
  create(heroesDto: CreateDadosHeroisDto): Promise<Heroes | null>;
  findAllHeroes(): Promise<Heroes[] | null>;
  findHeroesById(id: string): Promise<Heroes | null>;
  updateHeroes(id: string, heroesDto: UpdateDadosHeroisDto): Promise<void>;
  DeleteHeroes(id: string): Promise<number>;
  findAllByStudio(studioId: string): Promise<Heroes[] | null>;
  findAllByTeam(teamName: string): Promise<Heroes[] | null>;
  findAllByReleaseYear(year: number): Promise<Heroes[] | null>;
  findAllByMorality(morality: string): Promise<Heroes[] | null>;
  findAllByGenre(genre: string): Promise<Heroes[] | null>;
}
