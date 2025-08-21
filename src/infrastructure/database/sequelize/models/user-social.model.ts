import { Column, DataType, Model, Sequelize, Table } from "sequelize-typescript";

@Table({
  tableName: 'user_social',
  timestamps: false,
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

  @Column({ 
    type: DataType.INTEGER,
    allowNull: false
  })
  user_id: number;

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
    allowNull: true 
  })
  provider_user_id: string;

  @Column({
    type: DataType.DATE    
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: Sequelize.fn('NOW')
  })
  updated_at: Date
}
