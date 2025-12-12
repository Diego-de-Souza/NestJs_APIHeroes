import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { QuizLevel } from './quiz-level.model';

@Table({
  tableName: "quiz",
  timestamps: false,
  underscored: false
})
export class Quiz extends Model<Quiz> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255), 
    allowNull: true,
  })
  logo: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  theme: string;

  @HasMany(() => QuizLevel, { foreignKey: 'quiz_id', as: 'quiz_levels' })
  quiz_levels: QuizLevel[];
}