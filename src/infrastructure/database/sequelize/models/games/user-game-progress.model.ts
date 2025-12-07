import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../../../../infrastructure/database/sequelize/models/user.model';
import { Games } from '../../../../../infrastructure/database/sequelize/models/games/games.model';

@Table({ tableName: 'user_game_process', timestamps: false })
export class UserGameProcess extends Model<UserGameProcess> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  user_id: number;

  @ForeignKey(() => Games)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'game_id' })
  game_id: number;

  @Column({ type: DataType.SMALLINT, allowNull: false, field: 'lvl_user' })
  lvl_user: number;

  @Column({ type: DataType.INTEGER })
  score: number;

  @Column({ type: DataType.SMALLINT })
  attempts: number;

  @Column({ type: DataType.DATE, field: 'last_move_at' })
  last_move_at: Date;

  @Column({ type: DataType.JSONB })
  metadata: object;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Games)
  game: Games;
}