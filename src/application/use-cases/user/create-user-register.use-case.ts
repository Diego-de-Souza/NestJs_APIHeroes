import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { User } from "src/infrastructure/database/sequelize/models/user.model";
import { CreateUserDTO } from "src/interface/dtos/user/userCreate.dto";
import { RoleService } from "src/application/services/role.service";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { GenenerateHashUseCase } from "../auth/generate-hash.use-case";

@Injectable()
export class CreateUserRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly generateHashUseCase: GenenerateHashUseCase
    ) {}

  async register(userDto: CreateUserDTO): Promise<ApiResponseInterface<User>> {
    const exists = await this.userRepository.findByEmail(userDto.firstemail);

    if (exists) {
        return {
        status: HttpStatus.CONFLICT,
        message: 'Usuário já existe',
        };
    }

    const senhaHash = await this.generateHashUseCase.generateHash(userDto.password);

    if (!senhaHash) {
        return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Erro ao gerar hash da senha.',
        };
    }

    userDto.password = senhaHash;
    console.log('DTO antes do create:', userDto);
    const userCreated = await this.userRepository.create(userDto);
    console.log('Resultado do create:', userCreated);
    if (!userCreated) {
        return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro ao criar o usuário.',
        };
    }

    await this.roleService.assignDefaultRole(userCreated.id); 

    return {
        status: HttpStatus.CREATED,
        message: 'Usuário registrado com sucesso',
        dataUnit: userCreated,
    };
  }

}
