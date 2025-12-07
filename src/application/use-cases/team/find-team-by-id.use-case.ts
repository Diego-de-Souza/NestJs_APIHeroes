import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Team } from "../../../infrastructure/database/sequelize/models/equipes.model";
import { TeamRepository } from "../../../infrastructure/repositories/team.repository";

@Injectable()
export class findTeamByIdUseCase {
    
    constructor(
        private readonly teamRepository: TeamRepository
    ){}

    async findOneTeam(id: number): Promise<ApiResponseInterface<Team>>{
        const team = await this.teamRepository.findTeamById(id);

        if(!team){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Team não encontrado."
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Team obtido com sucesso.",
            dataUnit: team
        }
    }
}