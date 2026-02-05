import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
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

    async findLatestProgressByUserId(userId: string): Promise<UserQuizProgress | null> {
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

    async findQuizLevelById(id: string): Promise<QuizLevel | null> {
        return await this.quizLevelModel.findOne({
            where: { id: id }
        });
    }

    async findAllQuizLevelsById(quizId: string): Promise<QuizLevel[] | null> {
        const _quiz_level = await this.quizLevelModel.findAll({ where: { quiz_id: quizId } });
        return _quiz_level.map(q => q.get({ plain: true }));
    }

    async findQuestionQuiz(quiz_level_id: string): Promise<QuizQuestion[] | null> {
        return await this.quizQuestionsModel.findAll({where: {quiz_level_id: quiz_level_id}})
    }

    async findIdQuiz(quiz_level_id: string): Promise<string | null> {
        const quizLevel = await this.quizLevelModel.findOne({
            where: { id: quiz_level_id },
            attributes: ['quiz_id']
        });
        return quizLevel ? (quizLevel.quiz_id as string) : null;
    }

    async findAllQuestions(quizLevelId: string): Promise<QuizQuestion[] | null> {
        const questions = await this.quizQuestionsModel.findAll({ where: { quiz_level_id: quizLevelId } });
        return questions.map(q => q.get({ plain: true }));
    }

    async updatedProgress(dataUpdate: any, userProgressId: string): Promise<number> {
        const [affectedCount] = await this.userQuizProgressModel.update(dataUpdate, { where: { id: userProgressId } });
        return affectedCount;
    }

    async createProgress(data: any): Promise<UserQuizProgress> {
        return await this.userQuizProgressModel.create(data);
    }

    async findQuizById(id: string): Promise<Quiz | null> {
        const quiz = await this.quizModel.findOne({
            where: { id: id }
        });
        return quiz ? quiz.get({ plain: true }) : null;
    }

    async deleteQuizById(id: string): Promise<void> {
        await this.quizModel.destroy({
            where: { id: id }
        });
    }

    async deleteQuizLevelById(id: string, levelId: string): Promise<void> {
        await this.quizLevelModel.destroy({
            where: {
                id: levelId,
                quiz_id: id
            }
        })
    }

    async deleteOneQuestion(questionId: string): Promise<void> {
        await this.quizQuestionsModel.destroy({
            where: {
                id: questionId
            }
        });
    }

    async deleteAllQuestions(quizLevelId: string): Promise<void> {
        await this.quizQuestionsModel.destroy({
            where: {
                quiz_level_id: quizLevelId
            }
        });
    }

    async updateQuiz(id: string, quizDto: any): Promise<number> {
        const [affectedCount] = await this.quizModel.update(quizDto, {
            where: { id }
        });
        return affectedCount;
    }

    async updateQuizLevel(id: string, quizLevelDto: any): Promise<number> {
        const [affectedCount] = await this.quizLevelModel.update(quizLevelDto, {
            where: { id }
        });
        return affectedCount;
    }

    async updateQuestions(quiz_level_id: string, dataDto: any): Promise<number> {
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