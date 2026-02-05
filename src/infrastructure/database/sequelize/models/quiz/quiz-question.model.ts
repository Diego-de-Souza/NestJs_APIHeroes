import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { QuizLevel } from './quiz-level.model';

@Table({ tableName: 'quiz_questions', timestamps: false })
export class QuizQuestion extends Model<QuizQuestion> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @ForeignKey(() => QuizLevel)
  @Column({ type: DataType.UUID, field: 'quiz_level_id' })
  quiz_level_id: string;

  @Column({ type: DataType.TEXT })
  question: string;

  @Column({ type: DataType.TEXT })
  answer: string;

  @Column({ type: DataType.JSONB })
  options: string[];

  @BelongsTo(() => QuizLevel)
  quiz_level: QuizLevel;
}