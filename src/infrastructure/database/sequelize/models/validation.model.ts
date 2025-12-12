import { Table, Column, Model, DataType, ForeignKey, Index, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model'; 

@Table({
  tableName: "validations", 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_validations_user_id',
      fields: ['user_id']
    },
    {
      name: 'idx_validations_token_id', 
      fields: ['token_id'],
      unique: true
    },
    {
      name: 'idx_validations_expires_at',
      fields: ['expires_at']
    }
  ]
})
export class Validation extends Model<Validation> {
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
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  access_token: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  refresh_token: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expires_at: Date;

  @Column({
    type: DataType.STRING(32),
    allowNull: false,
    unique: true,
  })
  token_id: string; 

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  device_info: string;

  @Column({
    type: DataType.STRING(39), 
    allowNull: true,
  })
  ip_address: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_used_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updated_at: Date;

  @BelongsTo(() => User, 'user_id')
  user: User;
}