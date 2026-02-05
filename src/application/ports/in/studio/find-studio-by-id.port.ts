import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Studio } from '../../../../infrastructure/database/sequelize/models/studio.model';

/** Port IN: contrato para buscar estúdio por ID. Controller → Port → UseCase. */
export interface IFindStudioByIdPort {
  execute(id: string): Promise<ApiResponseInterface<Studio>>;
}
