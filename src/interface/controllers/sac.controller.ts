import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, ParseIntPipe } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateContactDto } from "../dtos/sac/create-contact.dto";
import { CreateResponseDto } from "../dtos/sac/create-response.dto";
import { UpdateStatusDto } from "../dtos/sac/update-status.dto";
import { FilterContactsDto } from "../dtos/sac/filter-contacts.dto";
import { SacService } from "../../application/services/sac.service";
import { SacContact } from "../../infrastructure/database/sequelize/models/sac-contact.model";
import { SacResponse } from "../../infrastructure/database/sequelize/models/sac-response.model";
import { AuthGuard } from "../guards/auth.guard";
import { Request } from "express";

@Controller("sac")
export class SacController {

    constructor(private readonly sacService: SacService){}

    @Post('contacts')
    @UseGuards(AuthGuard)
    async createContact(@Body() contactDto: CreateContactDto, @Req() req: Request): Promise<ApiResponseInterface<SacContact>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Não autorizado. Faça login para enviar uma solicitação.',
                };
            }

            const result = await this.sacService.createContact(contactDto, usuario_id);
            
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

            const result = await this.sacService.findAllContacts(filters);
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
    async findOneContact(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<SacContact>> {
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
            const result = await this.sacService.findContactById(id, userRole === 'admin' || userRole === 'root' ? 0 : usuario_id);
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
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() statusDto: UpdateStatusDto, @Req() req: Request): Promise<ApiResponseInterface<SacContact>> {
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

            const result = await this.sacService.updateContactStatus(id, statusDto);
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
    async deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<void>> {
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

            const result = await this.sacService.deleteContact(id);
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
        @Param('id', ParseIntPipe) contact_id: number, 
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
            const checkContact = await this.sacService.findContactById(contact_id, userRole === 'admin' || userRole === 'root' ? 0 : usuario_id);
            
            if (checkContact.status === 404 || !checkContact.dataUnit) {
                return {
                    status: 404,
                    message: 'Solicitação não encontrada.',
                };
            }

            // Autor pode ser o nome do usuário ou "Equipe de Suporte" para admins
            const author = userRole === 'admin' || userRole === 'root' ? 'Equipe de Suporte' : user?.nickname || 'Usuário';

            const result = await this.sacService.createResponse(contact_id, responseDto, author);
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
