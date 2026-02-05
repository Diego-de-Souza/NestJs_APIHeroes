import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Team } from "../../../infrastructure/database/sequelize/models/equipes.model";
import type { ITeamRepository } from "../../ports/out/team.port";
import type { IFindAllTeamPort } from "../../ports/in/team/find-all-team.port";

@Injectable()
export class FindAllTeamUseCase implements IFindAllTeamPort {
    constructor(
        @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<Team>> {
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