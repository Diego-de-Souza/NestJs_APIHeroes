import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Heroes } from "../database/sequelize/models/heroes.model";
import { CreateDadosHeroisDto } from "../../interface/dtos/dados-herois/create-dados-herois.dto";
import { UpdateDadosHeroisDto } from "../../interface/dtos/dados-herois/update-dados-herois.dto";
import { WhereOptions } from "sequelize";

@Injectable()
export class HeroesRepository {
    
    constructor(
        @InjectModel(Heroes) private readonly heroesModel: typeof Heroes
    ){}

    async create(heroesDto: CreateDadosHeroisDto): Promise<Heroes | null>{
        return await this.heroesModel.create(heroesDto);
    }

    async findAllHeroes(): Promise<Heroes[] | null>{
        return await this.heroesModel.findAll();
    }

    async findHeroesById(id: number): Promise<Heroes | null>{
        return await this.heroesModel.findOne({where: {id}});
    }

    async updateHeroes(id:number, heroesDto: UpdateDadosHeroisDto): Promise<void>{
        const hero = new Heroes(heroesDto);
        await this.heroesModel.update(hero, {where: {id}});
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
}