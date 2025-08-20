import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: "quiz_questions",
  timestamps: false,
})
export class QuizQuestions extends Model<QuizQuestions> {
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
  quiz_level_id : number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question : string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  answer: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false
  })
  options: string[];
}