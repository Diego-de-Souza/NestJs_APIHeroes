import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Team } from "../../../infrastructure/database/sequelize/models/equipes.model";
import type { ITeamRepository } from "../../ports/out/team.port";
import type { IFindTeamByIdPort } from "../../ports/in/team/find-team-by-id.port";

@Injectable()
export class findTeamByIdUseCase implements IFindTeamByIdPort {
    constructor(
        @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository
    ) {}

    async execute(id: string): Promise<ApiResponseInterface<Team>> {
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