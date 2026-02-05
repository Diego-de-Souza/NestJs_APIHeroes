import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Team } from "src/infrastructure/database/sequelize/models/team.model";
import { CreateTeamDto } from "src/interface/dtos/team/create-team.dto";


export interface IUpdateTeamPort {
    execute(id: string, teamDto: CreateTeamDto): Promise<ApiResponseInterface<Team>>;
}