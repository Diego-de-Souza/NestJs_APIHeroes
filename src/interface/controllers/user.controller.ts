import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Inject,
} from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDTO } from "../dtos/user/userCreate.dto";
import { UpdateUserDTO } from "../dtos/user/UserUpdate.dto";
import { AuthGuard } from "../guards/auth.guard";
import type { ICreateUserPort } from "../../application/ports/in/user/create-user.port";
import type { IFindUserByIdPort } from "../../application/ports/in/user/find-user-by-id.port";
import type { IFindUserAllPort } from "../../application/ports/in/user/find-user-all.port";
import type { IUpdateUserPort } from "../../application/ports/in/user/update-user.port";

@ApiTags('Users')
@Controller("user")
export class UserController {
  constructor(
    @Inject('ICreateUserPort') private readonly createUserPort: ICreateUserPort,
    @Inject('IFindUserByIdPort') private readonly findUserByIdPort: IFindUserByIdPort,
    @Inject('IFindUserAllPort') private readonly findUserAllPort: IFindUserAllPort,
    @Inject('IUpdateUserPort') private readonly updateUserPort: IUpdateUserPort,
  ) {}

  @UseGuards(AuthGuard)
  @Get('find-one-user/:id')
  @ApiOperation({ summary: 'Buscar usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar usuário' })
  async findOne(@Param("id") id: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findUserByIdPort.execute(id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro ao buscar usuário.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Post("register-user")
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro ao registrar usuário' })
  async Register(@Body("data") user: CreateUserDTO): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.createUserPort.execute(user);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro ao registrar usuário.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put("update/:id")
  @ApiOperation({ summary: 'Atualizar usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar usuário' })
  async Update(
    @Body("data") user: UpdateUserDTO,
    @Param("id") id: string,
  ): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.updateUserPort.execute(id, user);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro ao atualizar usuário.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-all-user')
  @ApiOperation({ summary: 'Buscar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Erro na busca de usuários' })
  async findAllUser(): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findUserAllPort.execute();
    } catch (error: unknown) {
      const err = error as Error;
      throw new BadRequestException({
        status: 401,
        message: `Erro na busca de usuarios (controller): ${err?.message ?? error}`,
      });
    }
  }
}
