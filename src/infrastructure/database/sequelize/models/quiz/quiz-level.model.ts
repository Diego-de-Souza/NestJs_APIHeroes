import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { Quiz } from './quiz.model';

@Table({
  tableName: "quiz_levels",
  timestamps: false,
})
export class QuizLevel extends Model<QuizLevel> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
      type: DataType.INTEGER,
      allowNull: false,
  })
  quiz_id : number;

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