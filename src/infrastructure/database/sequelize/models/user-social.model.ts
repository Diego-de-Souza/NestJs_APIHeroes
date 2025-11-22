import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user.model";

@Table({
  tableName: 'user_social',
  timestamps: true,
  underscored: true,
})
export class UserSocial extends Model<UserSocial> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ 
    type: DataType.INTEGER,
    allowNull: true,
    field: 'user_id'
  })
  userId: number;

  @Column({ 
    type: DataType.STRING(100),
    allowNull: false
  })
  email: string;

  @Column({ 
    type: DataType.STRING(50), 
    allowNull: false
  })
  provider: string;

  @Column({ 
    type: DataType.STRING,
    allowNull: true,
    field: 'provider_user_id'
  })
  providerUserId: string;

  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}