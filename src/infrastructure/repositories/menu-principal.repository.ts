import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Studio } from "../database/sequelize/models/studio.model";
import { Team } from "../database/sequelize/models/equipes.model";
import { Heroes } from "../database/sequelize/models/heroes.model";
import type { IMenuPrincipalRepository } from "../../application/ports/out/menu-principal.port";

@Injectable()
export class MenuPrincipalRepository implements IMenuPrincipalRepository {
    
    constructor(
        @InjectModel(Studio) private readonly studioModel: typeof Studio,
        @InjectModel(Team) private readonly teamModel: typeof Team,
        @InjectModel(Heroes) private readonly heroesModel: typeof Heroes
    ){}

    async findAllStudio(): Promise<Studio[] | null> {
        return await this.studioModel.findAll({ attributes: ['id','name'] });
    }

    async findAllTeam(): Promise<Team[] | null>{
        return await this.teamModel.findAll({ attributes: ['id','name'] });
    }

    async findAllMorality(): Promise<Heroes[] | null>{
        return await this.heroesModel.findAll({ attributes: ['morality'], group: ['morality'] });
    }

    async findAllGenre(): Promise<Heroes[] | null>{
        return await this.heroesModel.findAll({ attributes: ['genre'], group: ['genre'] });
    }
}