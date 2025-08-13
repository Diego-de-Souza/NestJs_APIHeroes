import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Team } from './equipes.model';
import { Studio } from './studio.model';

@Table({
  tableName: "heroes",
  timestamps: false,
})
export class Heroes extends Model<Heroes> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(100), // Define limite de 100 caracteres
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Studio)
  @Column({
    type: DataType.INTEGER, 
    allowNull: false,
  })
  studio_id: number;

  @Column({
    type: DataType.STRING(50), 
  })
  power_type: string;

  @Column({
    type: DataType.STRING(50), 
  })
  morality: string;

  @Column({
    type: DataType.STRING(255), 
  })
  first_appearance: string;

  @Column({
    type: DataType.DATEONLY, 
  })
  release_date: Date;

  @Column({
    type: DataType.STRING(50), 
  })
  creator: string;

  @Column({
    type: DataType.STRING(100), 
  })
  weak_point: string;

  @Column({
    type: DataType.STRING(100), 
  })
  affiliation: string;

  @Column({
    type: DataType.STRING(255), 
  })
  story: string;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
  })
  team_id: number;

  @Column({
    type: DataType.STRING(50),
  })
  genre: string;

  @Column({
    type: DataType.BLOB('medium'), // Mudança aqui: BLOB para MEDIUMBLOB
  })
  image1: Buffer;

  @Column({
    type: DataType.BLOB('medium'), // Mudança aqui: BLOB para MEDIUMBLOB
  })
  image2: Buffer;
}
