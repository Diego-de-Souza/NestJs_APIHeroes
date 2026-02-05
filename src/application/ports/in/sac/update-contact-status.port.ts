import { UpdateStatusDto } from '../../../../interface/dtos/sac/update-status.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { SacContact } from '../../../../infrastructure/database/sequelize/models/sac-contact.model';

/** Port IN: contrato para atualizar status do contato SAC. Controller → Port → UseCase. */
export interface IUpdateContactStatusPort {
  execute(id: string, statusDto: UpdateStatusDto): Promise<ApiResponseInterface<SacContact>>;
}
