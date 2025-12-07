import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { Team } from "../../infrastructure/database/sequelize/models/equipes.model";
import { CreateTeamDto } from "../../interface/dtos/team/create-team.dto";
import { CreateTeamUseCase } from "../../application/use-cases/team/create-team.use-case";
import { findTeamByIdUseCase } from "../../application/use-cases/team/find-team-by-id.use-case";
import { FindAllTeamUseCase } from "../../application/use-cases/team/find-all-team.use-case";


@Injectable()
export class TeamService {
    constructor(
        private readonly createTeamUseCase: CreateTeamUseCase,
        private readonly findTeamByIdUseCase: findTeamByIdUseCase,
        private readonly findAllTeamUseCase: FindAllTeamUseCase
    ){}

    async create(teamDto: CreateTeamDto): Promise<ApiResponseInterface<Team>>{
        return await this.createTeamUseCase.create(teamDto);
    }

    async findTeamById(id: number): Promise<ApiResponseInterface<Team>>{
        return await this.findTeamByIdUseCase.findOneTeam(id);
    }

    async findAllTeam(): Promise<ApiResponseInterface<Team>>{
        return await this.findAllTeamUseCase.findAllTeam();
    }
}