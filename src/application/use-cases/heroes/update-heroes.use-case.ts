import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";
import { UpdateDadosHeroisDto } from "../../../interface/dtos/dados-herois/update-dados-herois.dto";
import { ImageService } from "../../services/image.service";

@Injectable()
export class UpdateHeroesUseCase {
    private readonly logger = new Logger(UpdateHeroesUseCase.name);
    
    constructor(
        private readonly heroesRepository: HeroesRepository,
        private readonly imageService: ImageService
    ){}

    async updateHeroes(id: number, heroesDto: UpdateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>>{
        const heroesExists = await this.heroesRepository.findHeroesById(id);

        if(!heroesExists){
            return{
                status: HttpStatus.NOT_FOUND,
                message: "Não existe este herói cadastrado."
            }
        }

        // Salva as imagens no CloudFlare se existirem
        if (heroesDto.image1) {
            try {
                this.logger.log('Salvando image1 no CloudFlare...');
                // Deleta a imagem antiga se existir
                if (heroesExists.image1 && typeof heroesExists.image1 === 'string') {
                    try {
                        await this.imageService.deleteImage(heroesExists.image1);
                        this.logger.log(`Imagem antiga image1 deletada: ${heroesExists.image1}`);
                    } catch (error) {
                        this.logger.warn('Erro ao deletar imagem antiga image1:', error);
                    }
                }
                const image1Url = await this.imageService.saveImageBuffer(
                    heroesDto.image1 as Buffer,
                    'heroes',
                    'image/jpeg'
                );
                // Salva a URL diretamente em image1 (substituindo o buffer)
                (heroesDto as any).image1 = image1Url;
                this.logger.log(`Image1 salva com sucesso: ${image1Url}`);
            } catch (error) {
                this.logger.error('Erro ao salvar image1 no CloudFlare:', error);
            }
        }

        if (heroesDto.image2) {
            try {
                this.logger.log('Salvando image2 no CloudFlare...');
                // Deleta a imagem antiga se existir
                if (heroesExists.image2 && typeof heroesExists.image2 === 'string') {
                    try {
                        await this.imageService.deleteImage(heroesExists.image2);
                        this.logger.log(`Imagem antiga image2 deletada: ${heroesExists.image2}`);
                    } catch (error) {
                        this.logger.warn('Erro ao deletar imagem antiga image2:', error);
                    }
                }
                const image2Url = await this.imageService.saveImageBuffer(
                    heroesDto.image2 as Buffer,
                    'heroes',
                    'image/jpeg'
                );
                // Salva a URL diretamente em image2 (substituindo o buffer)
                (heroesDto as any).image2 = image2Url;
                this.logger.log(`Image2 salva com sucesso: ${image2Url}`);
            } catch (error) {
                this.logger.error('Erro ao salvar image2 no CloudFlare:', error);
            }
        }

        await this.heroesRepository.updateHeroes(id, heroesDto);

        return{
            status: HttpStatus.OK,
            message: "Herói atualizado com sucesso."
        }
    }
}