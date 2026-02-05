import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'studios',
  timestamps: false,
})
export class Studio extends Model<Studio> {
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
      unique: true,
      allowNull: false,
    })
  name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  nationality: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  history: string;
}