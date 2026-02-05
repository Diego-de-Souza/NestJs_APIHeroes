import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { User } from "../../../infrastructure/database/sequelize/models/user.model";
import type { IUserRepository } from "../../ports/out/user.port";
import type { IFindUserAllPort } from "../../ports/in/user/find-user-all.port";

@Injectable()
export class FindUserAllUseCase implements IFindUserAllPort {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<User>> {
        const users = await this.userRepository.findAllUser();

        if(!users){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Dados de usuários não encontrados."
            }
        }
        
        return {
            status: HttpStatus.OK,
            message: "Usuários obtidos com sucesso",
            data:users
        }
    }
}