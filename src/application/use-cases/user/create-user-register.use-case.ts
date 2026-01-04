import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { User } from "../../../infrastructure/database/sequelize/models/user.model";
import { CreateUserDTO } from "../../../interface/dtos/user/userCreate.dto";
import { RoleService } from "../../../application/services/role.service";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { GenenerateHashUseCase } from "../auth/generate-hash.use-case";

@Injectable()
export class CreateUserRegisterUseCase {
  private readonly logger = new Logger(CreateUserRegisterUseCase.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly generateHashUseCase: GenenerateHashUseCase
    ) {}

  async register(userDto: CreateUserDTO): Promise<ApiResponseInterface<User>> {
    const exists = await this.userRepository.findByEmail(userDto.firstemail);

    if (exists) {
        throw new ConflictException('Usuário já existe');
    }

    const senhaHash = await this.generateHashUseCase.generateHash(userDto.password);

    if (!senhaHash) {
        throw new BadRequestException('Erro ao gerar hash da senha.');
    }

    userDto.password = senhaHash;
    this.logger.debug('DTO antes do create:', userDto);
    const userCreated = await this.userRepository.create(userDto);
    this.logger.debug('Resultado do create:', userCreated);
    if (!userCreated) {
        throw new InternalServerErrorException('Erro ao criar o usuário.');
    }

    await this.roleService.assignDefaultRole(userCreated.id); 

    return {
        status: HttpStatus.CREATED,
        message: 'Usuário registrado com sucesso',
        dataUnit: userCreated,
    };
  }

}
