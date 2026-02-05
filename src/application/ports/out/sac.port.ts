import { CreateContactDto } from '../../../interface/dtos/sac/create-contact.dto';
import { CreateResponseDto } from '../../../interface/dtos/sac/create-response.dto';
import { FilterContactsDto } from '../../../interface/dtos/sac/filter-contacts.dto';
import { SacContact } from '../../../infrastructure/database/sequelize/models/sac-contact.model';
import { SacResponse } from '../../../infrastructure/database/sequelize/models/sac-response.model';

/** Port OUT: contrato do repositório SAC. UseCase → Port → Repository. */
export interface ISacRepository {
  createContact(contactDto: CreateContactDto, usuario_id: string): Promise<SacContact>;
  findContactById(id: string): Promise<SacContact | null>;
  findContactByIdAndUserId(id: string, usuario_id: string): Promise<SacContact | null>;
  findContactsByUserId(usuario_id: string, filters?: { type?: string; status?: string }): Promise<SacContact[]>;
  findAllContacts(filters: FilterContactsDto): Promise<{ contacts: SacContact[]; total: number }>;
  updateContactStatus(id: string, status: string): Promise<void>;
  deleteContact(id: string): Promise<number>;
  createResponse(contact_id: string, responseDto: CreateResponseDto, author: string): Promise<SacResponse>;
  findResponsesByContactId(contact_id: string): Promise<SacResponse[]>;
}
