import { CreateUserDTO } from '../../../interface/dtos/user/userCreate.dto';
import { UpdateUserDTO } from '../../../interface/dtos/user/UserUpdate.dto';
import { User } from '../../../infrastructure/database/sequelize/models/user.model';

/** Port OUT: contrato do repositório de usuário. UseCase → Port → Repository. */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(dto: CreateUserDTO): Promise<User | null>;
  update(id: string, dto: UpdateUserDTO): Promise<void>;
  findAllUser(): Promise<User[] | null>;
  updatePassword(id: string, newPassword: string): Promise<void>;
  findUserRoleById(id: string): Promise<User | null>;
}
