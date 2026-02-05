import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import type { IStudioRepository } from "../../ports/out/studio.port";
import type { ITeamRepository } from "../../ports/out/team.port";
import { CreateDadosHeroisDto } from "../../../interface/dtos/dados-herois/create-dados-herois.dto";
import { ImageService } from "../../services/image.service";
import type { ICreateHeroesPort } from "../../ports/in/heroes/create-heroes.port";

@Injectable()
export class CreateHeroesUseCase implements ICreateHeroesPort {
    private readonly logger = new Logger(CreateHeroesUseCase.name);

    constructor(
        @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository,
        @Inject('IStudioRepository') private readonly studioRepository: IStudioRepository,
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository,
        private readonly imageService: ImageService
    ) {}

    async execute(heroesDto: CreateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>> {
        try {
            const foreignKeyCheck = await this.verifyForeignKey(heroesDto);
            this.logger.log('Resultado da verificação:', foreignKeyCheck);

            if (!foreignKeyCheck.status) {
                this.logger.error('Foreign key check falhou, retornando erro');
                return {
                    message: foreignKeyCheck.message || "Erro ao verificar dados relacionados",
                    status: HttpStatus.BAD_REQUEST,
                };
            }

            if (heroesDto.image1 && Buffer.isBuffer(heroesDto.image1)) {
                try {
                    this.logger.log('Salvando image1 no S3...');
                    const image1Url = await this.imageService.saveImageBuffer(
                        heroesDto.image1,
                        'heroes',
                        'image/jpeg'
                    );
                    (heroesDto as unknown as Record<string, unknown>).image1 = image1Url;
                    this.logger.log(`Image1 salva com sucesso: ${image1Url}`);
                } catch (error) {
                    this.logger.error('Erro ao salvar image1 no S3:', error);
                }
            }
            // Se image1 for string (URL), mantém como está (já é URL válida)

            if (heroesDto.image2 && Buffer.isBuffer(heroesDto.image2)) {
                try {
                    this.logger.log('Salvando image2 no S3...');
                    const image2Url = await this.imageService.saveImageBuffer(
                        heroesDto.image2,
                        'heroes',
                        'image/jpeg'
                    );
                    (heroesDto as unknown as Record<string, unknown>).image2 = image2Url;
                    this.logger.log(`Image2 salva com sucesso: ${image2Url}`);
                } catch (error) {
                    this.logger.error('Erro ao salvar image2 no S3:', error);
                }
            }
            // Se image2 for string (URL), mantém como está (já é URL válida)

            const createdHero = await this.heroesRepository.create(heroesDto);

            return {
                status: HttpStatus.CREATED,
                message: "Heroi adicionado com sucesso",
                dataUnit: createdHero ?? undefined,
            };
        } catch (error: unknown) {
            const err = error as Error;
            this.logger.error('Erro ao criar herói:', error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro interno do servidor ao criar herói",
                error: (err?.message ?? String(error)),
            };
        }
    }

    private async verifyForeignKey(hero: CreateDadosHeroisDto): Promise<{ status: boolean; message?: string }> {
        const teamId = (hero as unknown as Record<string, unknown>).team_id as string | undefined;
        if (teamId) {
            const teamExists = await this.teamRepository.findTeamById(teamId);
            if (!teamExists) {
                this.logger.error('Equipe não encontrada, retornando erro');
                return { status: false, message: "Equipe não encontrada." };
            }
        }

        if (hero.studio_id) {
            const studioExists = await this.studioRepository.findStudioById(hero.studio_id);
            if (!studioExists) {
                this.logger.error('Studio não encontrado, retornando erro');
                return { status: false, message: "Studio não encontrado." };
            }
        }

        return { status: true, message: "Dados encontrados com sucesso." };
    }
}
