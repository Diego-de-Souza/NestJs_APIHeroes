import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { QuizLevel } from './quiz-level.model';

@Table({ tableName: 'quiz_questions', timestamps: false })
export class QuizQuestion extends Model<QuizQuestion> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => QuizLevel)
  @Column({ type: DataType.INTEGER, field: 'quiz_level_id' })
  quiz_level_id: number;

  @Column({ type: DataType.TEXT })
  question: string;

  @Column({ type: DataType.TEXT })
  answer: string;

  @Column({ type: DataType.JSONB })
  options: string[];

  @BelongsTo(() => QuizLevel)
  quiz_level: QuizLevel;
}