import { Injectable } from "@nestjs/common";
import { User } from "src/infrastructure/database/sequelize/models/user.model";
import { CreateUserDTO } from "src/interface/dtos/user/userCreate.dto";
import { UpdateUserDTO } from "src/interface/dtos/user/UserUpdate.dto";
import { CreateUserRegisterUseCase } from "src/application/use-cases/user/create-user-register.use-case";
import { FindUserByIdUseCase } from "src/application/use-cases/user/find-user-by-id.use-case";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { UpdateUserByIdUseCase } from "src/application/use-cases/user/update-user-by-id.use-case";
import { FindUserAllUseCase } from "src/application/use-cases/user/find-user-all.use-case";

@Injectable()
export class UserService {
  constructor(
    private readonly createUserRegisterUseCase: CreateUserRegisterUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserByIdUseCase: UpdateUserByIdUseCase,
    private readonly findUserAllUseCase: FindUserAllUseCase
  ) {}

  async findById(id: number): Promise<ApiResponseInterface<User>> {
    return await this.findUserByIdUseCase.getUserById(id);
  }

  async register(user: CreateUserDTO): Promise<ApiResponseInterface<User>> {
    return this.createUserRegisterUseCase.register(user);
  }

  async update(id: number, userUpdate: UpdateUserDTO): Promise<ApiResponseInterface<User>>{
    return await this.updateUserByIdUseCase.update(id, userUpdate);
  }

  async getUserAll(): Promise<ApiResponseInterface<User>>{
    return await this.findUserAllUseCase.getUserAll();
  }

}
