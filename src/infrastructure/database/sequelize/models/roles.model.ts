import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'roles', timestamps: true })
export class Role extends Model<Role> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  role: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'usuario_id' })
  usuario_id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  access: string;

  @Column({ field: 'created_at' })
  createdAt: Date;

  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}