import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Team } from "../../../infrastructure/database/sequelize/models/index.model";
import type { ITeamRepository } from "../../ports/out/team.port";
import { CreateTeamDto } from "../../../interface/dtos/team/create-team.dto";
import type { ICreateTeamPort } from "../../ports/in/team/create-team.port";

@Injectable()
export class CreateTeamUseCase implements ICreateTeamPort {
    constructor(
        @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository
    ) {}

    async execute(teamDTO: CreateTeamDto): Promise<ApiResponseInterface<Team>> {
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
            dataUnit: teamCreated,
        };
    }
}