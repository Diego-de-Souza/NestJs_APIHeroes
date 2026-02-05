import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: "team",
  timestamps: false,
})
export class Team extends Model<Team> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

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