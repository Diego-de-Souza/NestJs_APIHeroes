import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { User } from "../../../infrastructure/database/sequelize/models/user.model";
import { CreateUserDTO } from "../../../interface/dtos/user/userCreate.dto";
import type { IUserRepository } from "../../ports/out/user.port";
import type { IRoleRepository } from "../../ports/out/role.port";
import { GenenerateHashUseCase } from "../auth/generate-hash.use-case";
import type { ICreateUserPort } from "../../ports/in/user/create-user.port";

@Injectable()
export class CreateUserRegisterUseCase implements ICreateUserPort {
  private readonly logger = new Logger(CreateUserRegisterUseCase.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    private readonly generateHashUseCase: GenenerateHashUseCase
  ) {}

  async execute(userDto: CreateUserDTO): Promise<ApiResponseInterface<User>> {
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

    await this.roleRepository.create({ role: "client", usuario_id: userCreated.id, access: "root" }); 

    return {
        status: HttpStatus.CREATED,
        message: 'Usuário registrado com sucesso',
        dataUnit: userCreated,
    };
  }

}
