import { Delete, Module } from '@nestjs/common';
import { QuizController } from "src/interface/controllers/quiz.controller";
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizService } from 'src/application/services/quiz.service';
import { CreateQuizUseCase } from 'src/application/use-cases/quiz/create-quiz.use-case';
import { QuizRepository } from 'src/infrastructure/repositories/quiz.repository';
import { FindProgressQuestionsByThemeUseCase } from 'src/application/use-cases/quiz/find-progress-questions-by-theme';
import { FindQuestionByIdUseCase } from 'src/application/use-cases/quiz/find-question-by-id.use-case';
import { ProcessAnswerQuizUseCase } from 'src/application/use-cases/quiz/process-answer-quiz.use-case';
import { CreateQuestionUseCase } from 'src/application/use-cases/quiz/create-questions.use-case';
import { FindAllQuizUseCase } from 'src/application/use-cases/quiz/find-all-quiz.use-case';
import { FindAllQuizLevelByIdUseCase } from 'src/application/use-cases/quiz/find-all-quiz-level.use-case';
import { FindAllQuizWithLevelsUseCase } from 'src/application/use-cases/quiz/find-all-quiz-with-levels.use-case';
import { DeleteQuizByIdUseCase } from 'src/application/use-cases/quiz/delete-quiz-by-id.use-case';
import { DeleteOneQuizUseCase } from 'src/application/use-cases/quiz/delete-one-question.use-case';
import { DeleteAllQuestionsUseCase } from 'src/application/use-cases/quiz/delete-all-questions.use-case';
import { FindOneQuizAndQuizLevelUseCase } from 'src/application/use-cases/quiz/find-one-quiz-and-quiz-level.use-case';
import { UpdateQuizUseCase } from 'src/application/use-cases/quiz/update-quiz.use-case';
import { FindAllQuestionsUseCase } from 'src/application/use-cases/quiz/find-all-questions.use-case';
import { UpdateQuestionsUseCase } from 'src/application/use-cases/quiz/update-questions.use-case';

@Module({
    imports: [SequelizeModule.forFeature(models)],
    controllers: [QuizController],
    providers: [
        QuizService,
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