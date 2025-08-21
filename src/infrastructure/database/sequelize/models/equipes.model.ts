import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: "team",
  timestamps: false,
})
export class Team extends Model<Team> {
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
      unique: true
  })
  name : string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  creator : string;
}