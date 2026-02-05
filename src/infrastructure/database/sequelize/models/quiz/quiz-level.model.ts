import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Quiz } from './quiz.model';

@Table({
  tableName: "quiz_levels",
  timestamps: false,
})
export class QuizLevel extends Model<QuizLevel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @ForeignKey(() => Quiz)
  @Column({
      type: DataType.UUID,
      allowNull: false,
      field: 'quiz_id',
  })
  quiz_id : string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name : string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false
  })
  difficulty: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  unlocked: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  questions: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  xp_reward: number;

  @BelongsTo(() => Quiz, 'quiz_id')
  quiz: Quiz;
}