import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";
import { StudioRepository } from "../../../infrastructure/repositories/studio.repository";
import { TeamRepository } from "../../../infrastructure/repositories/team.repository";
import { CreateDadosHeroisDto } from "../../../interface/dtos/dados-herois/create-dados-herois.dto";

@Injectable()
export class CreateHeroesUseCase {

    constructor(
        private readonly teamRepository: TeamRepository,
        private readonly studioRepository: StudioRepository,
        private readonly heroesRepository: HeroesRepository
    ){}

    async create(heroesDto: CreateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>>{
    try {
        console.log('=== USE CASE - INICIANDO ===');
        console.log('heroesDto recebido:', {
            name: heroesDto.name,
            studio_id: heroesDto.studio_id,
            team_id: heroesDto.team_id
        });

        console.log('Verificando foreign keys...');
        const foreignKeyCheck = await this.VerifyForeignKey(heroesDto);
        console.log('Resultado da verificação:', foreignKeyCheck);
        
        if(!foreignKeyCheck.status){
            console.log('Foreign key check falhou, retornando erro');
            return {
                message: foreignKeyCheck.message || "Erro ao verificar dados relacionados",
                status : HttpStatus.BAD_REQUEST
            };
        }

        console.log('Foreign keys OK, criando herói...');
        const createdHero = await this.heroesRepository.create(heroesDto);
        console.log('Herói criado com sucesso!');

        return{
            status : HttpStatus.CREATED,
            message: "Heroi adicionado com sucesso",
            dataUnit: createdHero
        }
    } catch (error) {
        console.error('=== ERRO NO USE CASE ===');
        console.error('Erro ao criar herói:', error);
        
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Erro interno do servidor ao criar herói",
            error: error.message || error
        };
    }
}

private async VerifyForeignKey(hero){
    console.log('Verificando team_id:', hero.team_id);
    const teamExists = await this.teamRepository.findTeamById(hero.team_id);
    console.log('Team encontrado:', !!teamExists);

    if( hero.team_id && !teamExists){
        console.log('Team não encontrado, retornando false');
        return {
            status: false,
            message: "Equipe não encontrada."
        }
    }

    console.log('Verificando studio_id:', hero.studio_id);
    const studioExists = await this.studioRepository.findStudioById(hero.studio_id);
    console.log('Studio encontrado:', !!studioExists);

    if(hero.studio_id && !studioExists){
        console.log('Studio não encontrado, retornando false');
        return {
            status: false,
            message: "Studio não encontrado."
        }
    }
    
    console.log('Todas as foreign keys OK');
    return {
        status: true,
        message: "Dados encontrados com sucesso."
    }
}
}