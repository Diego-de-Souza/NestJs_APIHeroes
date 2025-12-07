import { 
  BadRequestException,
    Body, 
    Controller, 
    Get, 
    Param, 
    ParseIntPipe, 
    Post, 
    Put, 
    UseGuards
} from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDTO } from "../dtos/user/userCreate.dto";
import { UpdateUserDTO } from "../dtos/user/UserUpdate.dto";
import { UserService } from "../../application/services/user.service";
import { AuthGuard } from "../guards/auth.guard";
  
@ApiTags('Users') 
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}
  
  @UseGuards(AuthGuard)
  @Get('find-one-user/:id')
  @ApiOperation({ summary: 'Buscar usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar usuário' })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<ApiResponseInterface> {
    try {
      const result = await this.userService.findById(id);
      return result;
    } catch (error) {
      return {
        status: 500,
        message: 'Erro ao buscar usuário.',
        error: error.message || error,
      };
    }
  }

  
  @Post("register-user") 
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro ao registrar usuário' })
  async Register(@Body("data") user: CreateUserDTO): Promise<ApiResponseInterface> {
    try {
      const result = await this.userService.register(user); 
  
      return result;
    } catch (error) {
      return {
        status: 500,
        message: 'Erro ao registrar usuário.',
        error: error.message || error,
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
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ApiResponseInterface> {
    try {
      const result = await this.userService.update(id, user); 
  
      return result;
    } catch (error) {
      return {
        status: 500,
        message: 'Erro ao atualizar usuário.',
        error: error.message || error,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-all-user')
  @ApiOperation({ summary: 'Buscar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Erro na busca de usuários' })
  async findAllUser(){
    try{
      const result = await this.userService.getUserAll();
      return result
    }catch(error){
      throw new BadRequestException({
        status: 401,
        message: `Erro na busca de usuarios (controller): ${error.message}`,
      });
    }
  }
}
  