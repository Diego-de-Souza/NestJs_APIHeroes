import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import type { IStudioRepository } from "../../ports/out/studio.port";
import type { ITeamRepository } from "../../ports/out/team.port";
import { HeroesData } from "../../../domain/interfaces/card_heroes.interface";
import type { IFindHeroesByIdPort } from "../../ports/in/heroes/find-heroes-by-id.port";

@Injectable()
export class FindHeroesByIdUseCase implements IFindHeroesByIdPort {
    private readonly logger = new Logger(FindHeroesByIdUseCase.name);

    constructor(
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository,
        @Inject('IStudioRepository') private readonly studioRepository: IStudioRepository,
        @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository
    ) {}

    async execute(id: string): Promise<ApiResponseInterface<HeroesData>> {
        try{
            const heroes = await this.heroesRepository.findHeroesById(id);

            if(!heroes){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Não foi encontrado nenhum herói."
                }
            }

            const studio_name = await this.studioRepository.findStudioById(heroes.dataValues.studio_id);
            const team_name = await this.teamRepository.findTeamById(heroes.dataValues.team_id);

            if(!studio_name || !team_name){
                return{
                    status: HttpStatus.NOT_FOUND,
                    message: "Não foi encontrado studio ou Equipe."
                }
            }

            const data_heroes: HeroesData = {
                id: heroes.id,
                name: heroes.name,
                studio: studio_name.name,
                power_type: heroes.power_type,
                morality: heroes.morality,
                first_appearance: heroes.first_appearance,
                release_data: heroes.release_date instanceof Date ? heroes.release_date : new Date(heroes.release_date as string | Date),
                creator: heroes.creator,
                weak_point: heroes.weak_point,
                affiliation: heroes.affiliation,
                story: heroes.story,
                team: team_name.name,
                genre: heroes.genre === "male"? "Masculino": "Feminino",
                image1: heroes.image1,
                image2: heroes.image2 
            }

            return {
                status: HttpStatus.OK,
                message: "Herói encontrado com sucesso.",
                dataUnit: data_heroes
            }
        } catch (error: unknown) {
            const err = error as Error;
            this.logger.error('Erro ao buscar dados do herói:', error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro interno do servidor ao buscar dados do herói",
                error: (err?.message ?? String(error)),
            };
        }
    }
}