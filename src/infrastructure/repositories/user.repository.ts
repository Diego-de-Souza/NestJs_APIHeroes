import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../database/sequelize/models/user.model";
import { CreateUserDTO } from "../../interface/dtos/user/userCreate.dto";
import { UpdateUserDTO } from "../../interface/dtos/user/UserUpdate.dto";
import { Role } from "../database/sequelize/models/roles.model";
import type { IUserRepository } from "../../application/ports/out/user.port";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null>{
    return this.userModel.findOne({where: {firstemail:email}});
  }

  async create(dto: CreateUserDTO): Promise<User | null> {
    return this.userModel.create(dto);
  }

  async update(id: string, dto: UpdateUserDTO): Promise<void> {
    await this.userModel.update(dto, { where: { id } });
  }

  async findAllUser(): Promise<User[] | null>{
    return this.userModel.findAll();
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.userModel.update(
        { password: newPassword },
        { where: { id } }
    );
  }

  async findUserRoleById(id: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { id },
      include: [{ model: Role, as: 'roles' }]
    });
  }
}
