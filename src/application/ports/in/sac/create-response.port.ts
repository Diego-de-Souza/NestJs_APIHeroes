import { CreateResponseDto } from '../../../../interface/dtos/sac/create-response.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { SacResponse } from '../../../../infrastructure/database/sequelize/models/sac-response.model';

/** Port IN: contrato para criar resposta SAC. Controller → Port → UseCase. */
export interface ICreateResponsePort {
  execute(contact_id: string, responseDto: CreateResponseDto, author: string): Promise<ApiResponseInterface<SacResponse>>;
}
