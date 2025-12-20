import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Heroes } from "../database/sequelize/models/heroes.model";
import { CreateDadosHeroisDto } from "../../interface/dtos/dados-herois/create-dados-herois.dto";
import { UpdateDadosHeroisDto } from "../../interface/dtos/dados-herois/update-dados-herois.dto";
import { WhereOptions, Op } from "sequelize";
import { TeamRepository } from "./team.repository";

@Injectable()
export class HeroesRepository {
    
    constructor(
        @InjectModel(Heroes) private readonly heroesModel: typeof Heroes,
        private readonly teamRepository: TeamRepository
    ){}

    async create(heroesDto: CreateDadosHeroisDto): Promise<Heroes | null>{
        return await this.heroesModel.create(heroesDto as any);
    }

    async findAllHeroes(): Promise<Heroes[] | null>{
        return await this.heroesModel.findAll();
    }

    async findHeroesById(id: number): Promise<Heroes | null>{
        return await this.heroesModel.findOne({where: {id}});
    }

    async updateHeroes(id:number, heroesDto: UpdateDadosHeroisDto): Promise<void>{
        await this.heroesModel.update(heroesDto as any, {where: {id}});
    }

    async DeleteHeroes(id: number): Promise<number>{
        return await this.heroesModel.destroy({where: {id}});
    }

    async findBy(field: keyof Heroes, value: string | number): Promise<Heroes[] | null> {
        const whereCondition: WhereOptions<Heroes> = {
            [field]: value
        };
        return await this.heroesModel.findAll({ where: whereCondition });
    }

    async findAllByStudio(studioId: number): Promise<Heroes[] | null> {
        return this.findBy('studio_id', studioId);
    }

    async findAllByTeam(teamName: string): Promise<Heroes[] | null> {
        const teamId = await this.teamRepository.findIdByName(teamName);
        if (!teamId) {
            return null;
        }
        return this.heroesModel.findAll({where: {team_id: teamId}});
    }

    async findAllByReleaseYear(year: number): Promise<Heroes[] | null> {
        // Busca heróis onde o ano do release_date corresponde ao ano fornecido
        const startDate = new Date(year, 0, 1); // 1º de janeiro do ano
        const endDate = new Date(year, 11, 31); // 31 de dezembro do ano
        
        return this.heroesModel.findAll({
            where: {
                release_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    }

    async findAllByMorality(morality: string): Promise<Heroes[] | null> {
        return this.findBy('morality', morality);
    }

    async findAllByGenre(genre: string): Promise<Heroes[] | null> {
        return this.findBy('genre', genre);
    }
}