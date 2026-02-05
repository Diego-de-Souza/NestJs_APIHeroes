import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { User } from "../../../infrastructure/database/sequelize/models/user.model";
import type { IUserRepository } from "../../ports/out/user.port";
import type { IFindUserByIdPort } from "../../ports/in/user/find-user-by-id.port";

@Injectable()
export class FindUserByIdUseCase implements IFindUserByIdPort {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<ApiResponseInterface<User>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Dado não encontrado',
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Busca realizada com sucesso',
      dataUnit: user,
    };
  }
}
