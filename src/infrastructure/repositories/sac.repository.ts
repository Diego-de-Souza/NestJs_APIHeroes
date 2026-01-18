import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, QueryTypes, Transaction } from "sequelize";
import { SacContact } from "../database/sequelize/models/sac-contact.model";
import { SacResponse } from "../database/sequelize/models/sac-response.model";
import { SacAttachment } from "../database/sequelize/models/sac-attachment.model";
import { CreateContactDto } from "../../interface/dtos/sac/create-contact.dto";
import { CreateResponseDto } from "../../interface/dtos/sac/create-response.dto";
import { FilterContactsDto } from "../../interface/dtos/sac/filter-contacts.dto";

@Injectable()
export class SacRepository {

    constructor(
        @InjectModel(SacContact) private readonly sacContactModel: typeof SacContact,
        @InjectModel(SacResponse) private readonly sacResponseModel: typeof SacResponse,
        @InjectModel(SacAttachment) private readonly sacAttachmentModel: typeof SacAttachment
    ){}

    private async generateTicketNumber(transaction?: Transaction): Promise<string> {
        const sequelize = this.sacContactModel.sequelize;
        const year = new Date().getFullYear();

        // Atualiza ou cria registro do ano atual e retorna o último número
        const [result]: any = await sequelize.query(
            `INSERT INTO sac_ticket_sequence (year, last_number, updated_at)
             VALUES (:year, 0, CURRENT_TIMESTAMP)
             ON CONFLICT (year) DO UPDATE SET 
                last_number = sac_ticket_sequence.last_number + 1,
                updated_at = CURRENT_TIMESTAMP
             RETURNING last_number`,
            {
                replacements: { year },
                type: QueryTypes.SELECT,
                transaction
            }
        );

        // Se o resultado não vier ou vier com problema, tenta uma segunda abordagem
        if (!result || result.length === 0) {
            const [sequenceResult]: any = await sequelize.query(
                `UPDATE sac_ticket_sequence 
                 SET last_number = last_number + 1, updated_at = CURRENT_TIMESTAMP
                 WHERE year = :year
                 RETURNING last_number`,
                {
                    replacements: { year },
                    type: QueryTypes.SELECT,
                    transaction
                }
            );
            
            const lastNumber = sequenceResult && sequenceResult.length > 0 ? sequenceResult[0].last_number : 1;
            return `TKT-${year}-${String(lastNumber).padStart(4, '0')}`;
        }

        const lastNumber = result[0]?.last_number || (result.last_number || 0);
        return `TKT-${year}-${String(lastNumber).padStart(4, '0')}`;
    }

    async createContact(contactDto: CreateContactDto, usuario_id: number): Promise<SacContact> {
        const transaction = await this.sacContactModel.sequelize.transaction();
        
        try {
            const ticket_number = await this.generateTicketNumber(transaction);
            
            const contact = await this.sacContactModel.create({
                ...contactDto,
                usuario_id,
                ticket_number,
                priority: contactDto.priority || 'normal',
                status: 'aberto'
            }, { transaction });

            await transaction.commit();
            return contact;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findContactById(id: number): Promise<SacContact> {
        return await this.sacContactModel.findOne({
            where: { id },
            include: [
                { model: SacResponse, as: 'responses', required: false },
                { model: SacAttachment, as: 'attachments', required: false }
            ]
        });
    }

    async findContactByIdAndUserId(id: number, usuario_id: number): Promise<SacContact> {
        return await this.sacContactModel.findOne({
            where: { id, usuario_id },
            include: [
                { model: SacResponse, as: 'responses', required: false },
                { model: SacAttachment, as: 'attachments', required: false }
            ]
        });
    }

    async findContactsByUserId(usuario_id: number, filters?: { type?: string, status?: string }): Promise<SacContact[]> {
        const where: any = { usuario_id };
        
        if (filters?.type) {
            where.type = filters.type;
        }
        
        if (filters?.status) {
            where.status = filters.status;
        }

        return await this.sacContactModel.findAll({
            where,
            order: [['createdAt', 'DESC']],
            include: [
                { model: SacResponse, as: 'responses', required: false, limit: 1, order: [['createdAt', 'DESC']] }
            ]
        });
    }

    async findAllContacts(filters: FilterContactsDto): Promise<{ contacts: SacContact[], total: number }> {
        const where: any = {};
        
        if (filters.usuario_id) {
            where.usuario_id = filters.usuario_id;
        }
        
        if (filters.type) {
            where.type = filters.type;
        }
        
        if (filters.status) {
            where.status = filters.status;
        }
        
        if (filters.priority) {
            where.priority = filters.priority;
        }

        if (filters.search) {
            where[Op.or] = [
                { ticket_number: { [Op.iLike]: `%${filters.search}%` } },
                { subject: { [Op.iLike]: `%${filters.search}%` } },
                { message: { [Op.iLike]: `%${filters.search}%` } }
            ];
        }

        if (filters.date_from || filters.date_to) {
            where.createdAt = {};
            if (filters.date_from) {
                where.createdAt[Op.gte] = new Date(filters.date_from);
            }
            if (filters.date_to) {
                const dateTo = new Date(filters.date_to);
                dateTo.setHours(23, 59, 59, 999);
                where.createdAt[Op.lte] = dateTo;
            }
        }

        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 100);
        const offset = (page - 1) * limit;

        const { rows, count } = await this.sacContactModel.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        return { contacts: rows, total: count };
    }

    async updateContactStatus(id: number, status: string): Promise<void> {
        await this.sacContactModel.update({ status }, { where: { id } });
    }

    async deleteContact(id: number): Promise<number> {
        return await this.sacContactModel.destroy({ where: { id } });
    }

    async createResponse(contact_id: number, responseDto: CreateResponseDto, author: string): Promise<SacResponse> {
        return await this.sacResponseModel.create({
            ...responseDto,
            contact_id,
            author
        });
    }

    async findResponsesByContactId(contact_id: number): Promise<SacResponse[]> {
        return await this.sacResponseModel.findAll({
            where: { contact_id },
            order: [['createdAt', 'ASC']],
            include: [
                { model: SacAttachment, as: 'attachments', required: false }
            ]
        });
    }

    async createAttachment(attachmentData: {
        contact_id?: number | null,
        response_id?: number | null,
        file_name: string,
        file_path: string,
        file_size: number,
        mime_type: string
    }): Promise<SacAttachment> {
        return await this.sacAttachmentModel.create(attachmentData);
    }

    async findAttachmentById(id: number): Promise<SacAttachment> {
        return await this.sacAttachmentModel.findOne({ where: { id } });
    }
}
