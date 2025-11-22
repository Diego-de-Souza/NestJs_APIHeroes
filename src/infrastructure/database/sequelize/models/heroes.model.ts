import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Studio } from './studio.model';
import { Team } from './team.model';

@Table({ tableName: 'heroes', timestamps: false })
export class Heroes extends Model<Heroes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @ForeignKey(() => Studio)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'studio_id' })
  studio_id: number;

  @Column({ type: DataType.STRING(50), field: 'power_type' })
  power_type: string;

  @Column({ type: DataType.STRING(50) })
  morality: string;

  @Column({ type: DataType.STRING(255), field: 'first_appearance' })
  first_appearance: string;

  @Column({ type: DataType.DATEONLY, field: 'release_date' })
  release_date: Date;

  @Column({ type: DataType.STRING(50) })
  creator: string;

  @Column({ type: DataType.STRING(100), field: 'weak_point' })
  weak_point: string;

  @Column({ type: DataType.STRING(100) })
  affiliation: string;

  @Column({ type: DataType.STRING(255) })
  story: string;

  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER, field: 'team_id' })
  team_id: number;

  @Column({ type: DataType.STRING(50) })
  genre: string;

  @Column({ type: DataType.BLOB, field: 'image1' })
  image1: Buffer;

  @Column({ type: DataType.BLOB, field: 'image2' })
  image2: Buffer;

  @BelongsTo(() => Studio)
  studio: Studio;

  @BelongsTo(() => Team)
  team: Team;
}