import { CreateContactDto } from '../../../../interface/dtos/sac/create-contact.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { SacContact } from '../../../../infrastructure/database/sequelize/models/sac-contact.model';

/** Port IN: contrato para criar contato SAC. Controller → Port → UseCase. */
export interface ICreateContactPort {
  execute(contactDto: CreateContactDto, usuario_id: string): Promise<ApiResponseInterface<SacContact>>;
}
