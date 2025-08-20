import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Quiz } from './quiz.model';
import { QuizLevel } from './quiz-level.model';
import { User } from '../user.model';

@Table({ tableName: 'user_quiz_progress', timestamps: false })
export class UserQuizProgress extends Model<UserQuizProgress> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.INTEGER, allowNull: false })
  quiz_id: number;

  @ForeignKey(() => QuizLevel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  quiz_level_id: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  completed: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  score: number;

  @Column({ type: DataType.JSON })
  skipped_questions: number[];

  @Column({ type: DataType.JSON })
  answered_questions: number[];

  @Column({ type: DataType.DATE })
  finished_at: Date;
}