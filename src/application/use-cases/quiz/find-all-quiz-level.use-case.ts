import { Injectable, Logger, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class FindAllQuizLevelByIdUseCase {
    private readonly logger = new Logger(FindAllQuizLevelByIdUseCase.name);
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async getAllQuizLevelsById(id: number): Promise<ApiResponseInterface<{ id: number; name: string; questionCount: number }[]>> {
        try{
            this.logger.debug(`Buscando níveis de quiz para ID: ${id}`);
            const quizLevels = await this.quizRepository.findAllQuizLevelsById(id);
            
            if(!quizLevels){
                throw new NotFoundException('Níveis de quiz não encontrados.');
            }

            const _dataQuizLevels: Array<{ id: number; name: string; questionCount: number }> = [];
            for(let quizLevel of quizLevels){
                _dataQuizLevels.push({ id: quizLevel.id, name: quizLevel.name, questionCount: quizLevel.questions });
            }

            return {
                status: 200,
                message: 'Dados encontrados com sucesso.',
                data: _dataQuizLevels
            }
        }catch(error){
            this.logger.error('Erro ao buscar níveis de quiz:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Erro ao buscar níveis de quiz.');
        }
    }
}