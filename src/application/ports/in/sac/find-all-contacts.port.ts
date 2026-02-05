import { FilterContactsDto } from '../../../../interface/dtos/sac/filter-contacts.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { SacContact } from '../../../../infrastructure/database/sequelize/models/sac-contact.model';

/** Port IN: contrato para listar contatos SAC. Controller → Port → UseCase. */
export interface IFindAllContactsPort {
  execute(filters: FilterContactsDto): Promise<ApiResponseInterface<SacContact>>;
}
