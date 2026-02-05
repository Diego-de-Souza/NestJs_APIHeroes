import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { User } from '../../../../infrastructure/database/sequelize/models/user.model';

/** Port IN: contrato para buscar usuário por ID. Controller → Port → UseCase. */
export interface IFindUserByIdPort {
  execute(id: string): Promise<ApiResponseInterface<User>>;
}
