import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, Inject } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateContactDto } from "../dtos/sac/create-contact.dto";
import { CreateResponseDto } from "../dtos/sac/create-response.dto";
import { UpdateStatusDto } from "../dtos/sac/update-status.dto";
import { FilterContactsDto } from "../dtos/sac/filter-contacts.dto";
import { SacContact } from "../../infrastructure/database/sequelize/models/sac-contact.model";
import { SacResponse } from "../../infrastructure/database/sequelize/models/sac-response.model";
import { AuthGuard } from "../guards/auth.guard";
import { Request } from "express";
import type { ICreateContactPort } from "../../application/ports/in/sac/create-contact.port";
import type { IFindAllContactsPort } from "../../application/ports/in/sac/find-all-contacts.port";
import type { IFindContactByIdPort } from "../../application/ports/in/sac/find-contact-by-id.port";
import type { IUpdateContactStatusPort } from "../../application/ports/in/sac/update-contact-status.port";
import type { IDeleteContactPort } from "../../application/ports/in/sac/delete-contact.port";
import type { ICreateResponsePort } from "../../application/ports/in/sac/create-response.port";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("sac")
export class SacController {

    constructor(
        @Inject('ICreateContactPort') private readonly createContactPort: ICreateContactPort,
        @Inject('IFindAllContactsPort') private readonly findAllContactsPort: IFindAllContactsPort,
        @Inject('IFindContactByIdPort') private readonly findContactByIdPort: IFindContactByIdPort,
        @Inject('IUpdateContactStatusPort') private readonly updateContactStatusPort: IUpdateContactStatusPort,
        @Inject('IDeleteContactPort') private readonly deleteContactPort: IDeleteContactPort,
        @Inject('ICreateResponsePort') private readonly createResponsePort: ICreateResponsePort,
    ){}

    @Post('contacts')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments', maxCount: 5 }]))
    @ApiOperation({ summary: 'Cria uma nova solicitação de suporte' })
    @ApiBody({ type: CreateContactDto })
    @ApiResponse({ status: 201, description: 'Solicitação criada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async createContact(
        @Body() contactDto: CreateContactDto,
        @UploadedFiles() files: { attachments?: Express.Multer.File[] },
        @Req() req: Request
    ): Promise<ApiResponseInterface<SacContact>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Não autorizado. Faça login para enviar uma solicitação.',
                };
            }

            const result = await this.createContactPort.execute(contactDto, usuario_id);
            
            // Ajustar mensagem para incluir ticket number
            if (result.dataUnit && result.dataUnit.ticket_number) {
                result.message = `Solicitação criada com sucesso! Ticket: #${result.dataUnit.ticket_number}`;
            }
            
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao criar Solicitação.',
                error: error.message || error,
            };
        }
    }

    @Get('contacts')
    @UseGuards(AuthGuard)
    async findAllContacts(@Query() filters: FilterContactsDto, @Req() req: Request): Promise<ApiResponseInterface<SacContact>> {
        try {
            const user = req['user'];
            const authenticatedUserId = user?.id || user?.sub;
            
            // Se não for admin, retornar apenas do usuário logado
            const userRole = user?.role || 'client';
            if (userRole !== 'admin' && userRole !== 'root') {
                // Se não for admin, criar novo objeto com usuario_id forçado para o usuário autenticado
                filters = {
                    ...filters,
                    usuario_id: authenticatedUserId
                };
            }

            const result = await this.findAllContactsPort.execute(filters);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Solicitações.',
                error: error.message || error,
            };
        }
    }

    @Get('contacts/:id')
    @UseGuards(AuthGuard)
    async findOneContact(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<SacContact>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const userRole = user?.role || 'client';
            // Admin pode ver qualquer solicitação, client só pode ver as suas
            // Passar 0 para admin indica que pode ver qualquer contato (tratado no use case como null)
            const result = await this.findContactByIdPort.execute(id, userRole === 'admin' || userRole === 'root' ? null : usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Solicitação.',
                error: error.message || error,
            };
        }
    }

    @Patch('contacts/:id/status')
    @UseGuards(AuthGuard)
    async updateStatus(@Param('id') id: string, @Body() statusDto: UpdateStatusDto, @Req() req: Request): Promise<ApiResponseInterface<SacContact>> {
        try {
            const user = req['user'];
            const userRole = user?.role || 'client';
            
            // Apenas admins podem atualizar status
            if (userRole !== 'admin' && userRole !== 'root') {
                return {
                    status: 403,
                    message: 'Acesso negado. Apenas administradores podem atualizar o status.',
                };
            }

            const result = await this.updateContactStatusPort.execute(id, statusDto);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar status da Solicitação.',
                error: error.message || error,
            };
        }
    }

    @Delete('contacts/:id')
    @UseGuards(AuthGuard)
    async deleteOne(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<void>> {
        try {
            const user = req['user'];
            const userRole = user?.role || 'client';
            
            // Apenas admins podem excluir solicitações
            if (userRole !== 'admin' && userRole !== 'root') {
                return {
                    status: 403,
                    message: 'Acesso negado. Apenas administradores podem excluir solicitações.',
                };
            }

            const result = await this.deleteContactPort.execute(id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Solicitação.',
                error: error.message || error,
            };
        }
    }

    @Post('contacts/:id/responses')
    @UseGuards(AuthGuard)
    async createResponse(
        @Param('id') contact_id: string, 
        @Body() responseDto: CreateResponseDto,
        @Req() req: Request
    ): Promise<ApiResponseInterface<SacResponse>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            const userRole = user?.role || 'client';
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            // Buscar o contato para verificar propriedade ou se é admin
            // Passar null como usuario_id permite que admin veja qualquer contato
            const checkContact = await this.findContactByIdPort.execute(contact_id, userRole === 'admin' || userRole === 'root' ? 0 : usuario_id);
            
            if (checkContact.status === 404 || !checkContact.dataUnit) {
                return {
                    status: 404,
                    message: 'Solicitação não encontrada.',
                };
            }

            // Autor pode ser o nome do usuário ou "Equipe de Suporte" para admins
            const author = userRole === 'admin' || userRole === 'root' ? 'Equipe de Suporte' : user?.nickname || 'Usuário';

            const result = await this.createResponsePort.execute(contact_id, responseDto, author);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao criar Resposta.',
                error: error.message || error,
            };
        }
    }
}
