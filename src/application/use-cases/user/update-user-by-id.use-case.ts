import { HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "src/application/services/auth.service";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { User } from "src/infrastructure/database/sequelize/models/user.model";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { UpdateUserDTO } from "src/interface/dtos/user/UserUpdate.dto";
import { GenenerateHashUseCase } from "../auth/generate-hash.use-case";


@Injectable()
export class UpdateUserByIdUseCase {

    constructor( 
        private readonly userRepository: UserRepository,
        private readonly generateHashUseCase: GenenerateHashUseCase
    ){}

    async update(id: number, userDto: UpdateUserDTO): Promise<ApiResponseInterface<User>>{
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