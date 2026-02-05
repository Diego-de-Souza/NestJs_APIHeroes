import { CreateUserDTO } from '../../../../interface/dtos/user/userCreate.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { User } from '../../../../infrastructure/database/sequelize/models/user.model';

/** Port IN: contrato para registro de usuário. Controller → Port → UseCase. */
export interface ICreateUserPort {
  execute(userDto: CreateUserDTO): Promise<ApiResponseInterface<User>>;
}
