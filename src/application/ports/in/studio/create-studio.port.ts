import { CreateStudioDto } from '../../../../interface/dtos/studio/create-studio.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Studio } from '../../../../infrastructure/database/sequelize/models/studio.model';

/** Port IN: contrato para criação de estúdio. Controller → Port → UseCase. */
export interface ICreateStudioPort {
  execute(studioDto: CreateStudioDto): Promise<ApiResponseInterface<Studio>>;
}
