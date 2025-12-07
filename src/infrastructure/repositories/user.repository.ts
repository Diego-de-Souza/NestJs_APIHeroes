import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../database/sequelize/models/user.model";
import { CreateUserDTO } from "../../interface/dtos/user/userCreate.dto";
import { UpdateUserDTO } from "../../interface/dtos/user/UserUpdate.dto";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findById(id: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null>{
    return this.userModel.findOne({where: {firstemail:email}});
  }

  async create(dto: CreateUserDTO): Promise<User | null> {
    return this.userModel.create(dto);
  }

  async update(id: number, dto: UpdateUserDTO): Promise<void> {
    await this.userModel.update(dto, { where: { id } });
  }

  async findAllUser(): Promise<User[] | null>{
    return this.userModel.findAll();
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    await this.userModel.update(
        { password: newPassword },
        { where: { id } }
    );
  }
}
