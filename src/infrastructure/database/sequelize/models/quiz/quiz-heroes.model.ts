import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: "quiz_heroes",
  timestamps: false,
})
export class QuizHeroes extends Model<QuizHeroes> {
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
}