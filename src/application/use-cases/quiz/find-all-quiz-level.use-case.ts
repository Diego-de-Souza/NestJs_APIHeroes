import { Injectable } from "@nestjs/common";
import { QuizRepository } from "src/infrastructure/repositories/quiz.repository";

@Injectable()
export class FindAllQuizLevelByIdUseCase {
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async getAllQuizLevelsById(id: number): Promise<any> {
        try{
            console.log(id);
            const quizLevels = await this.quizRepository.findAllQuizLevelsById(id);
            console.log(quizLevels);
            if(!quizLevels){
                return {
                    status: 404,
                    message: 'Níveis de quiz não encontrados.'
                }
            }

            const _dataQuizLevels: any[] = [];
            for(let quizLevel of quizLevels){
                _dataQuizLevels.push({ id: quizLevel.id, name: quizLevel.name, questionCount: quizLevel.questions });
            }

            return {
                status: 200,
                message: 'Dados encontrados com sucesso.',
                data: _dataQuizLevels
            }
        }catch(error){
            return{
                status: 500,
                message: 'Erro ao buscar níveis de quiz.',
                error: error.message
            }
        }
    }
}