import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IUpdateTeamPort } from "../../ports/in/team/update-team.port";
import type { ITeamRepository } from "src/application/ports/out/team.port";
import { Team } from "src/infrastructure/database/sequelize/models/team.model";
import { CreateTeamDto } from "src/interface/dtos/team/create-team.dto";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";


@Injectable()
export class UpdateTeamUseCase implements IUpdateTeamPort {
    constructor(
        @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository
    ){}

    async execute(id: string, teamDto: CreateTeamDto): Promise<ApiResponseInterface<Team>> {
        const team = await this.teamRepository.findTeamById(id);

        if(!team){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Team não encontrado."
            }
        }

        await this.teamRepository.updateTeam(id, teamDto);

        return {
            status: HttpStatus.OK,
            message: "Team atualizado com sucesso."
        };
    }
}