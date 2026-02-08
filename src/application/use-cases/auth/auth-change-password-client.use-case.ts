import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { GenenerateHashUseCase } from "./generate-hash.use-case";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import type { IChangePasswordPort } from "../../ports/in/auth/change-password.port";

@Injectable()
export class AuthChangePasswordClientUseCase implements IChangePasswordPort {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly generateHashUseCase: GenenerateHashUseCase,
        private readonly userRepository: UserRepository
    ){}

    async execute(newPassword: string, id: string): Promise<ApiResponseInterface> {
        try{
            
            const user = await this.authRepository.findUserById(id);

            if (!user) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Usuário não encontrado."
                };
            }

            const hashedPassword = await this.generateHashUseCase.generateHash(newPassword);

            await this.userRepository.updatePassword(user.dataValues.id,hashedPassword);

            return {
                status: HttpStatus.OK,
                message: "Senha alterada com sucesso."
            };

        }catch(error){
            
        }
    }
}