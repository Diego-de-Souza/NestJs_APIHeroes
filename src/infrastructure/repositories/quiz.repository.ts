import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateQuizDto } from "src/interface/dtos/quiz/quizCreate.dto";
import {Quiz, UserQuizProgress, QuizLevel, QuizQuestion} from "../database/sequelize/models/index.model";

@Injectable()
export class QuizRepository {

    constructor(
        @InjectModel(UserQuizProgress) private readonly userQuizProgressModel: typeof UserQuizProgress,
        @InjectModel(Quiz) private readonly quizModel: typeof Quiz,
        @InjectModel(QuizLevel) private readonly quizLevelModel: typeof QuizLevel,
        @InjectModel(QuizQuestion) private readonly quizQuestionsModel: typeof QuizQuestion
    ){}

    async createQuiz(questionDTO: any): Promise<Quiz> {
        return await this.quizModel.create(questionDTO)
    }

    async createQuizLevel(quizLevelDTO: any): Promise<QuizLevel> {
        return await this.quizLevelModel.create(quizLevelDTO);
    }

    async createQuestion(questionDTO: any): Promise<QuizQuestion> {
        return await this.quizQuestionsModel.create(questionDTO);
    }

    async findLatestProgressByUserId(userId: number): Promise<UserQuizProgress | null> {
        const progress = await this.userQuizProgressModel.findOne({
            where: { user_id: userId },
            order: [['quiz_id', 'DESC']],
        });
        return progress ? progress.get({ plain: true }) : null;
    }

    async findAllQuiz(): Promise<Quiz[]>{
        const quiz = await this.quizModel.findAll();
        return quiz.map(q => q.get({ plain: true }));
    }

    async findAllQuizzes(): Promise<Quiz[]> {
        const quizzes = await this.quizModel.findAll({
            include: [
                {
                    model: this.quizLevelModel,
                    as: 'quiz_levels',
                }
            ]
        });
        return quizzes.map(q => q.get({ plain: true }));
    }

    async findQuizLevelById(id: number): Promise<QuizLevel | null> {
        return await this.quizLevelModel.findOne({
            where: { id: id }
        });
    }

    async findAllQuizLevelsById(quizId: number): Promise<QuizLevel[] | null> {
        const _quiz_level = await this.quizLevelModel.findAll({ where: { quiz_id: quizId } });
        return _quiz_level.map(q => q.get({ plain: true }));
    }

    async findQuestionQuiz(quiz_level_id:number): Promise<QuizQuestion[] | null> {
        return await this.quizQuestionsModel.findAll({where: {quiz_level_id: quiz_level_id}})
    }

    async findIdQuiz(quiz_level_id: number): Promise<number | null> {
        const quizLevel = await this.quizLevelModel.findOne({
            where: { id: quiz_level_id },
            attributes: ['quiz_id']
        });
        return quizLevel ? quizLevel.quiz_id : null;
    }

    async findAllQuestions(quizLevelId: number): Promise<QuizQuestion[] | null> {
        const questions = await this.quizQuestionsModel.findAll({ where: { quiz_level_id: quizLevelId } });
        return questions.map(q => q.get({ plain: true }));
    }

    async updatedProgress(dataUpdate: any, userProgress: number): Promise<number> {
        const [affectedCount] = await this.userQuizProgressModel.update(dataUpdate, { where: { id: userProgress } });
        return affectedCount;
    }

    async createProgress(data: any): Promise<UserQuizProgress> {
        return await this.userQuizProgressModel.create(data);
    }

    async findQuizById(id: number): Promise<Quiz | null> {
        const quiz = await this.quizModel.findOne({
            where: { id: id }
        });
        return quiz ? quiz.get({ plain: true }) : null;
    }

    async deleteQuizById(id: number): Promise<void> {
        await this.quizModel.destroy({
            where: { id: id }
        });
    }

    async deleteQuizLevelById(id: number, levelId: number): Promise<void> {
        await this.quizLevelModel.destroy({
            where: {
                id: levelId,
                quiz_id: id
            }
        })
    }

    async deleteOneQuestion(questionNumber: number): Promise<void> {
        await this.quizQuestionsModel.destroy({
            where: {
                id: questionNumber
            }
        });
    }

    async deleteAllQuestions(quizLevelId: number): Promise<void> {
        await this.quizQuestionsModel.destroy({
            where: {
                quiz_level_id: quizLevelId
            }
        });
    }

    async updateQuiz(id: number, quizDto: any): Promise<number> {
        const [affectedCount] = await this.quizModel.update(quizDto, {
            where: { id }
        });
        return affectedCount;
    }

    async updateQuizLevel(id: number, quizLevelDto: any): Promise<number> {
        const [affectedCount] = await this.quizLevelModel.update(quizLevelDto, {
            where: { id }
        });
        return affectedCount;
    }

    async updateQuestions(quiz_level_id:number, dataDto: any): Promise<number> {
        const [affectedCount] = await this.quizQuestionsModel.update(dataDto, {
            where: { id: dataDto.id, quiz_level_id: quiz_level_id }
        });
        return affectedCount;
    }

    // async findQuestionsByThemeAndByLevel(theme: string, difficulty: string): Promise<Quiz[]> {
    //     return await this.quizModel.findAll({
    //         where: {
    //             theme: theme,
    //             difficulty: difficulty
    //         }
    //     });
    // }
}