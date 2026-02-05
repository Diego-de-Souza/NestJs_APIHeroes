import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../user.model';
import { Quiz } from './quiz.model';
import { QuizLevel } from './quiz-level.model';

@Table({ tableName: 'user_quiz_progress', timestamps: false })
export class UserQuizProgress extends Model<UserQuizProgress> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  user_id: string;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.UUID, allowNull: false, field: 'quiz_id' })
  quiz_id: string;

  @ForeignKey(() => QuizLevel)
  @Column({ type: DataType.UUID, allowNull: false, field: 'quiz_level_id' })
  quiz_level_id: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  completed: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  score: number;

  @Column({ type: DataType.JSONB, field: 'skipped_questions' })
  skipped_questions: number[];

  @Column({ type: DataType.JSONB, field: 'answered_questions' })
  answered_questions: number[];

  @Column({ type: DataType.DATE, field: 'finished_at' })
  finished_at: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Quiz)
  quiz: Quiz;

  @BelongsTo(() => QuizLevel)
  quizLevel: QuizLevel;
}