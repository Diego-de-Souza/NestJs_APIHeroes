import { Module } from '@nestjs/common';
import { QuizController } from "../controllers/quiz.controller";
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizService } from 'src/application/services/quiz.service';
import { CreateQuestionUseCase } from 'src/application/use-cases/quiz/create-question.use-case';
import { QuizRepository } from 'src/infrastructure/repositories/quiz.repository';
import { FindQuestionsByTheme } from 'src/application/use-cases/quiz/find-questions-by-theme';

@Module({
    imports: [SequelizeModule.forFeature(models)],
    controllers: [QuizController],
    providers: [
        QuizService,
        CreateQuestionUseCase,
        FindQuestionsByTheme,
        QuizRepository
    ],
    exports: [
        QuizService,
        QuizRepository
    ]
})
export class QuizModule {}