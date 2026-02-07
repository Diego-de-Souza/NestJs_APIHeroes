import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Team } from "../../../../infrastructure/database/sequelize/models/equipes.model";
import { CreateTeamDto } from "../../../../interface/dtos/team/create-team.dto";


export interface IUpdateTeamPort {
    execute(id: string, teamDto: CreateTeamDto): Promise<ApiResponseInterface<Team>>;
}