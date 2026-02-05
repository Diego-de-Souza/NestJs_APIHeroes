import { UpdateUserDTO } from '../../../../interface/dtos/user/UserUpdate.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { User } from '../../../../infrastructure/database/sequelize/models/user.model';

/** Port IN: contrato para atualizar usuário. Controller → Port → UseCase. */
export interface IUpdateUserPort {
  execute(id: string, userDto: UpdateUserDTO): Promise<ApiResponseInterface<User>>;
}
