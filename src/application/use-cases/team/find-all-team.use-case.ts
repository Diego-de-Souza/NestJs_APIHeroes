import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Team } from "../../../infrastructure/database/sequelize/models/equipes.model";
import { TeamRepository } from "../../../infrastructure/repositories/team.repository";


@Injectable()
export class FindAllTeamUseCase {

    constructor(
        private readonly teamRepository: TeamRepository
    ){}

    async findAllTeam(): Promise<ApiResponseInterface<Team>>{
        const teamFull = await this.teamRepository.findAllTeam();

        if(!teamFull){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Erro na busca das Equipes"
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Equipes obtidas com sucesso.",
            data: teamFull
        }
    }
}