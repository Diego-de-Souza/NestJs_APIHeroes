import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Team } from "../database/sequelize/models/equipes.model";
import { CreateTeamDto } from "../../interface/dtos/team/create-team.dto";
import type { ITeamRepository } from "../../application/ports/out/team.port";

@Injectable()
export class TeamRepository implements ITeamRepository {
    constructor(@InjectModel(Team) private readonly teamModel: typeof Team) {}

    async findByTeam(name: string): Promise<Team | null>{
        return await this.teamModel.findOne({where: {name: name}});
    }

    async create(teamDto: CreateTeamDto): Promise<Team | null>{
        return await this.teamModel.create(teamDto);
    }

    async findTeamById(id: string): Promise<Team | null>{
        return await this.teamModel.findOne({where: {id}});
    }

    async findAllTeam(): Promise<Team[] | null>{
        return await this.teamModel.findAll();
    }

    async findIdByName(name: string): Promise<string | null> {
        return this.teamModel.findOne({where: {name}}).then(team => team?.id || null);
    }

    async updateTeam(id: string, teamDto: CreateTeamDto): Promise<void>{
        await this.teamModel.update(teamDto, {where: {id}});
    }
}