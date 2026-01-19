import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";
import { StudioRepository } from "../../../infrastructure/repositories/studio.repository";
import { TeamRepository } from "../../../infrastructure/repositories/team.repository";
import { CreateDadosHeroisDto } from "../../../interface/dtos/dados-herois/create-dados-herois.dto";
import { ImageService } from "../../services/image.service";

@Injectable()
export class CreateHeroesUseCase {
    private readonly logger = new Logger(CreateHeroesUseCase.name);

    constructor(
        private readonly teamRepository: TeamRepository,
        private readonly studioRepository: StudioRepository,
        private readonly heroesRepository: HeroesRepository,
        private readonly imageService: ImageService
    ){}

    async create(heroesDto: CreateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>>{
    try {
        const foreignKeyCheck = await this.VerifyForeignKey(heroesDto);
        this.logger.log('Resultado da verificação:', foreignKeyCheck);
        
        if(!foreignKeyCheck.status){
            this.logger.error('Foreign key check falhou, retornando erro');
            return {
                message: foreignKeyCheck.message || "Erro ao verificar dados relacionados",
                status : HttpStatus.BAD_REQUEST
            };
        }

        if (heroesDto.image1) {
            try {
                this.logger.log('Salvando image1 no S3...');
                const image1Url = await this.imageService.saveImageBuffer(
                    heroesDto.image1,
                    'heroes',
                    'image/jpeg'
                );
                
                // Salva a URL diretamente em image1 (substituindo o buffer)
                (heroesDto as any).image1 = image1Url;
                this.logger.log(`Image1 salva com sucesso: ${image1Url}`);
            } catch (error) {
                this.logger.error('Erro ao salvar image1 no S3:', error);
            }
        }

        if (heroesDto.image2) {
            try {
                this.logger.log('Salvando image2 no S3...');
                const image2Url = await this.imageService.saveImageBuffer(
                    heroesDto.image2,
                    'heroes',
                    'image/jpeg'
                );
                
                // Salva a URL diretamente em image2 (substituindo o buffer)
                (heroesDto as any).image2 = image2Url;
                this.logger.log(`Image2 salva com sucesso: ${image2Url}`);
            } catch (error) {
                this.logger.error('Erro ao salvar image2 no S3:', error);
            }
        }

        const createdHero = await this.heroesRepository.create(heroesDto);

        return{
            status : HttpStatus.CREATED,
            message: "Heroi adicionado com sucesso",
            dataUnit: createdHero
        }
    } catch (error) {
        this.logger.error('Erro ao criar herói:', error);        
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Erro interno do servidor ao criar herói",
            error: error.message || error
        };
    }
}

private async VerifyForeignKey(hero){
    const teamExists = await this.teamRepository.findTeamById(hero.team_id);

    if( hero.team_id && !teamExists){
        this.logger.error('Equipe não encontrada, retornando erro');
        return {
            status: false,
            message: "Equipe não encontrada."
        }
    }

    const studioExists = await this.studioRepository.findStudioById(hero.studio_id);

    if(hero.studio_id && !studioExists){
        this.logger.error('Studio não encontrado, retornando erro');
        return {
            status: false,
            message: "Studio não encontrado."
        }
    }
    
    return {
        status: true,
        message: "Dados encontrados com sucesso."
    }
}
}