import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Studio } from "../database/sequelize/models/studio.model";
import { Team } from "../database/sequelize/models/equipes.model";

@Injectable()
export class MenuPrincipalRepository {
    
    constructor(
        @InjectModel(Studio) private readonly studioModel: typeof Studio,
        @InjectModel(Team) private readonly teamModel: typeof Team
    ){}

    async findAllStudio(): Promise<Studio[] | null> {
        return await this.studioModel.findAll({ attributes: ['id','name'] });
    }

    async findAllTeam(): Promise<Team[] | null>{
        return await this.teamModel.findAll({ attributes: ['id','name'] });
    }
}