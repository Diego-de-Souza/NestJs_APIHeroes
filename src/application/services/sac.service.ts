import { Injectable } from "@nestjs/common";
import { CreateContactDto } from "../../interface/dtos/sac/create-contact.dto";
import { CreateResponseDto } from "../../interface/dtos/sac/create-response.dto";
import { UpdateStatusDto } from "../../interface/dtos/sac/update-status.dto";
import { FilterContactsDto } from "../../interface/dtos/sac/filter-contacts.dto";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../infrastructure/database/sequelize/models/sac-contact.model";
import { SacResponse } from "../../infrastructure/database/sequelize/models/sac-response.model";
import { CreateContactUseCase } from "../use-cases/sac/create-contact.use-case";
import { FindContactsByUserIdUseCase } from "../use-cases/sac/find-contacts-by-user-id.use-case";
import { FindContactByIdUseCase } from "../use-cases/sac/find-contact-by-id.use-case";
import { FindAllContactsUseCase } from "../use-cases/sac/find-all-contacts.use-case";
import { UpdateContactStatusUseCase } from "../use-cases/sac/update-contact-status.use-case";
import { DeleteContactUseCase } from "../use-cases/sac/delete-contact.use-case";
import { CreateResponseUseCase } from "../use-cases/sac/create-response.use-case";

@Injectable()
export class SacService {

    constructor(
        private readonly createContactUseCase: CreateContactUseCase,
        private readonly findContactsByUserIdUseCase: FindContactsByUserIdUseCase,
        private readonly findContactByIdUseCase: FindContactByIdUseCase,
        private readonly findAllContactsUseCase: FindAllContactsUseCase,
        private readonly updateContactStatusUseCase: UpdateContactStatusUseCase,
        private readonly deleteContactUseCase: DeleteContactUseCase,
        private readonly createResponseUseCase: CreateResponseUseCase,
    ){}

    async createContact(contactDto: CreateContactDto, usuario_id: number): Promise<ApiResponseInterface<SacContact>>{
        return await this.createContactUseCase.createContact(contactDto, usuario_id);
    }

    async findContactsByUserId(usuario_id: number, filters?: { type?: string, status?: string }): Promise<ApiResponseInterface<SacContact>>{
        return await this.findContactsByUserIdUseCase.findContactsByUserId(usuario_id, filters);
    }

    async findContactById(id: number, usuario_id: number | null): Promise<ApiResponseInterface<SacContact>>{
        return await this.findContactByIdUseCase.findContactById(id, usuario_id);
    }

    async findAllContacts(filters: FilterContactsDto): Promise<ApiResponseInterface<SacContact>>{
        return await this.findAllContactsUseCase.findAllContacts(filters);
    }

    async updateContactStatus(id: number, statusDto: UpdateStatusDto): Promise<ApiResponseInterface<SacContact>>{
        return await this.updateContactStatusUseCase.updateStatus(id, statusDto);
    }

    async deleteContact(id: number): Promise<ApiResponseInterface<void>>{
        return await this.deleteContactUseCase.deleteContact(id);
    }

    async createResponse(contact_id: number, responseDto: CreateResponseDto, author: string): Promise<ApiResponseInterface<SacResponse>>{
        return await this.createResponseUseCase.createResponse(contact_id, responseDto, author);
    }
}
