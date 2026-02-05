import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import { UpdateDadosHeroisDto } from "../../../interface/dtos/dados-herois/update-dados-herois.dto";
import { ImageService } from "../../services/image.service";
import type { IUpdateHeroesPort } from "../../ports/in/heroes/update-heroes.port";

@Injectable()
export class UpdateHeroesUseCase implements IUpdateHeroesPort {
    private readonly logger = new Logger(UpdateHeroesUseCase.name);

    constructor(
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository,
        private readonly imageService: ImageService
    ) {}

    async execute(id: string, heroesDto: UpdateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>> {
        const heroesExists = await this.heroesRepository.findHeroesById(id);

        if(!heroesExists){
            return{
                status: HttpStatus.NOT_FOUND,
                message: "Não existe este herói cadastrado."
            }
        }

        // Salva as imagens no S3 somente se forem Buffer (upload). Se forem URL (string), mantém como está.
        if (heroesDto.image1 && Buffer.isBuffer(heroesDto.image1)) {
            try {
                this.logger.log('Salvando image1 no S3...');
                if (heroesExists.image1 && typeof heroesExists.image1 === 'string') {
                    try {
                        await this.imageService.deleteImage(heroesExists.image1);
                        this.logger.log(`Imagem antiga image1 deletada: ${heroesExists.image1}`);
                    } catch (error) {
                        this.logger.warn('Erro ao deletar imagem antiga image1:', error);
                    }
                }
                const image1Url = await this.imageService.saveImageBuffer(
                    heroesDto.image1,
                    'heroes',
                    'image/jpeg'
                );
                (heroesDto as Record<string, unknown>).image1 = image1Url;
                this.logger.log(`Image1 salva com sucesso: ${image1Url}`);
            } catch (error) {
                this.logger.error('Erro ao salvar image1 no S3:', error);
            }
        }

        if (heroesDto.image2 && Buffer.isBuffer(heroesDto.image2)) {
            try {
                this.logger.log('Salvando image2 no S3...');
                if (heroesExists.image2 && typeof heroesExists.image2 === 'string') {
                    try {
                        await this.imageService.deleteImage(heroesExists.image2);
                        this.logger.log(`Imagem antiga image2 deletada: ${heroesExists.image2}`);
                    } catch (error) {
                        this.logger.warn('Erro ao deletar imagem antiga image2:', error);
                    }
                }
                const image2Url = await this.imageService.saveImageBuffer(
                    heroesDto.image2,
                    'heroes',
                    'image/jpeg'
                );
                (heroesDto as Record<string, unknown>).image2 = image2Url;
                this.logger.log(`Image2 salva com sucesso: ${image2Url}`);
            } catch (error) {
                this.logger.error('Erro ao salvar image2 no S3:', error);
            }
        }

        await this.heroesRepository.updateHeroes(id, heroesDto);

        return{
            status: HttpStatus.OK,
            message: "Herói atualizado com sucesso."
        }
    }
}