import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { User } from "../../../infrastructure/database/sequelize/models/user.model";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async getUserById(id: number): Promise<ApiResponseInterface<User>> {
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
