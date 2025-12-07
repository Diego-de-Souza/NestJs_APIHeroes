import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Team } from "../../../infrastructure/database/sequelize/models/index.model";
import { TeamRepository } from "../../../infrastructure/repositories/team.repository";
import { CreateTeamDto } from "../../../interface/dtos/team/create-team.dto";


@Injectable()
export class CreateTeamUseCase {
    
    constructor(
        private readonly teamRepository: TeamRepository
    ){}

    async create(teamDTO: CreateTeamDto): Promise<ApiResponseInterface<Team>>{
        const teamExists =  await this.teamRepository.findByTeam(teamDTO.name);

        if(teamExists){
            return {
                status: HttpStatus.CONFLICT,
                message: 'Usuário já existe',
            };
        }

        const teamCreated = await this.teamRepository.create(teamDTO);

        return {
            status: HttpStatus.CREATED,
            message: "Team criado com sucesso",
            dataUnit: teamCreated
        }
    }
}