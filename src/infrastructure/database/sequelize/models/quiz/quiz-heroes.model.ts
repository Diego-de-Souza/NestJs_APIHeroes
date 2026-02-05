import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { QuizLevel } from './quiz-level.model';

@Table({
  tableName: "quiz_heroes",
  timestamps: false,
})
export class QuizHeroes extends Model<QuizHeroes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @ForeignKey(() => QuizLevel)
  @Column({
      type: DataType.UUID,
      allowNull: false,
      field: 'quiz_level_id',
  })
  quiz_level_id : string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name : string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  image: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  quote: string;

  @BelongsTo(() => QuizLevel)
  quiz_level: QuizLevel;
}