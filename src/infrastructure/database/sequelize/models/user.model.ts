import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Role } from './roles.model';
import { UserSocial } from './user-social.model';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  fullname: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  nickname: string;

  @Column({ type: DataType.DATEONLY })
  birthdate: Date;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  firstemail: string;

  @Column({ type: DataType.STRING(100) })
  secondemail: string;

  @Column({ type: DataType.STRING(15) })
  phone: string;

  @Column({ type: DataType.STRING(15) })
  cellphone: string;

  @Column({ type: DataType.STRING(3) })
  uf: string;

  @Column({ type: DataType.STRING(150) })
  address: string;

  @Column({ type: DataType.STRING(100) })
  complement: string;

  @Column({ type: DataType.STRING(8) })
  cep: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  state: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  city: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  password: string;

  @Column({ type: DataType.STRING(255), field: 'totp_secret' })
  totp_secret: string;

  @Column({ type: DataType.STRING(255), field: 'mfa_secret' })
  mfa_secret: string;

  @Column({ type: DataType.STRING(255), field: 'token_fcm' })
  token_fcm: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'twofa_active',
  })
  twofaActive: boolean;

  @Column({ field: 'created_at' })
  createdAt: Date;

  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @HasMany(() => Role)
  roles: Role[];

  @HasMany(() => UserSocial)
  socials: UserSocial[];
}