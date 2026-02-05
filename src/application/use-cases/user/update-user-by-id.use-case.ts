import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { User } from "../../../infrastructure/database/sequelize/models/user.model";
import type { IUserRepository } from "../../ports/out/user.port";
import { UpdateUserDTO } from "../../../interface/dtos/user/UserUpdate.dto";
import { GenenerateHashUseCase } from "../auth/generate-hash.use-case";
import type { IUpdateUserPort } from "../../ports/in/user/update-user.port";

@Injectable()
export class UpdateUserByIdUseCase implements IUpdateUserPort {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        private readonly generateHashUseCase: GenenerateHashUseCase
    ) {}

    async execute(id: string, userDto: UpdateUserDTO): Promise<ApiResponseInterface<User>> {
        const exists = await this.userRepository.findById(id);

        if(!exists){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Requisição invalida",
            };
        }

        const senhaHash = await this.generateHashUseCase.generateHash(userDto.password);

        if (!senhaHash) {
            return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Erro ao gerar hash da senha.',
            };
        }

        if(exists.password === senhaHash || userDto === null){
            delete userDto.password;
        }

        await this.userRepository.update(id, userDto)

        return {
            status: HttpStatus.OK,
            message: 'Usuário atualizado com sucesso'
        };
    }
}