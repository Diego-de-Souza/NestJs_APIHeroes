import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Studio } from '../../../../infrastructure/database/sequelize/models/studio.model';

/** Port IN: contrato para listar todos os estúdios. Controller → Port → UseCase. */
export interface IFindAllStudioPort {
  execute(): Promise<ApiResponseInterface<Studio>>;
}
