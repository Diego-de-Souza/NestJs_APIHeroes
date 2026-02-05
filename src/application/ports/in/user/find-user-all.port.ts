import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { User } from '../../../../infrastructure/database/sequelize/models/user.model';

/** Port IN: contrato para listar todos os usuários. Controller → Port → UseCase. */
export interface IFindUserAllPort {
  execute(): Promise<ApiResponseInterface<User>>;
}
