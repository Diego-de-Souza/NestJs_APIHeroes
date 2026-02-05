import { Delete, Module } from '@nestjs/common';
import { QuizController } from "../../interface/controllers/quiz.controller";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizService } from '../../application/services/quiz.service';
import { CreateQuizUseCase } from '../../application/use-cases/quiz/create-quiz.use-case';
import { QuizRepository } from '../../infrastructure/repositories/quiz.repository';
import { FindProgressQuestionsByThemeUseCase } from '../../application/use-cases/quiz/find-progress-questions-by-theme';
import { FindQuestionByIdUseCase } from '../../application/use-cases/quiz/find-question-by-id.use-case';
import { ProcessAnswerQuizUseCase } from '../../application/use-cases/quiz/process-answer-quiz.use-case';
import { CreateQuestionUseCase } from '../../application/use-cases/quiz/create-questions.use-case';
import { FindAllQuizUseCase } from '../../application/use-cases/quiz/find-all-quiz.use-case';
import { FindAllQuizLevelByIdUseCase } from '../../application/use-cases/quiz/find-all-quiz-level.use-case';
import { FindAllQuizWithLevelsUseCase } from '../../application/use-cases/quiz/find-all-quiz-with-levels.use-case';
import { DeleteQuizByIdUseCase } from '../../application/use-cases/quiz/delete-quiz-by-id.use-case';
import { DeleteOneQuizUseCase } from '../../application/use-cases/quiz/delete-one-question.use-case';
import { DeleteAllQuestionsUseCase } from '../../application/use-cases/quiz/delete-all-questions.use-case';
import { FindOneQuizAndQuizLevelUseCase } from '../../application/use-cases/quiz/find-one-quiz-and-quiz-level.use-case';
import { UpdateQuizUseCase } from '../../application/use-cases/quiz/update-quiz.use-case';
import { FindAllQuestionsUseCase } from '../../application/use-cases/quiz/find-all-questions.use-case';
import { UpdateQuestionsUseCase } from '../../application/use-cases/quiz/update-questions.use-case';

@Module({
    imports: [SequelizeModule.forFeature(models)],
    controllers: [QuizController],
    providers: [
        QuizService,
        { provide: 'IQuizPort', useClass: QuizService },
        CreateQuizUseCase,
        CreateQuestionUseCase,
        FindProgressQuestionsByThemeUseCase,
        FindQuestionByIdUseCase,
        FindAllQuizUseCase,
        FindAllQuizLevelByIdUseCase,
        FindAllQuizWithLevelsUseCase,
        FindOneQuizAndQuizLevelUseCase,
        FindAllQuestionsUseCase,
        DeleteQuizByIdUseCase,
        DeleteOneQuizUseCase,
        DeleteAllQuestionsUseCase,
        ProcessAnswerQuizUseCase,
        UpdateQuizUseCase,
        UpdateQuestionsUseCase,
        QuizRepository
    ],
    exports: [
        QuizService,
        QuizRepository
    ]
})
export class QuizModule {}