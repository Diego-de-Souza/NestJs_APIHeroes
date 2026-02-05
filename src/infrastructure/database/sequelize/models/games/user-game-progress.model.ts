import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../../../../infrastructure/database/sequelize/models/user.model';
import { Games } from '../../../../../infrastructure/database/sequelize/models/games/games.model';

@Table({ tableName: 'user_game_process', timestamps: false })
export class UserGameProcess extends Model<UserGameProcess> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  user_id: string;

  @ForeignKey(() => Games)
  @Column({ type: DataType.UUID, allowNull: false, field: 'game_id' })
  game_id: string;

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