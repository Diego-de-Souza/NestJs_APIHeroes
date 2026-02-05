import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { SacContact } from '../../../../infrastructure/database/sequelize/models/sac-contact.model';

/** Port IN: contrato para buscar contato SAC por ID. Controller → Port → UseCase. */
export interface IFindContactByIdPort {
  execute(id: string, usuario_id: string | null): Promise<ApiResponseInterface<SacContact>>;
}
