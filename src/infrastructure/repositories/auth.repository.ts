import { InjectModel } from "@nestjs/sequelize";
import { User } from "../database/sequelize/models/user.model";
import { Injectable } from "@nestjs/common";
import { Role } from "../database/sequelize/models/roles.model";
import { UserSocial } from "../database/sequelize/models/user-social.model";
import { UserInterface } from "src/domain/interfaces/user.interface";

@Injectable()
export class AuthRepository {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        @InjectModel(UserSocial) private readonly userSocialModel: typeof UserSocial
    ){}

    async findByEmail(email: string): Promise<User>{
        return await this.userModel.findOne({where: {firstemail: email}}) 
    }

    async findRoleByUserId(usuario_id: number): Promise<Role>{
        return await this.roleModel.findOne({where: {usuario_id}});
    }

    async findUserById(id:number): Promise<User>{
        return await this.userModel.findOne({where:{id}});
    }

    async findOneUserSocial(email: string, provider: string): Promise<UserSocial>{
        const userSocial = await this.userSocialModel.findOne({
            where: {
                email: email,
                provider: provider
            }
        })
        return userSocial ? userSocial.get({ plain: true }) : null;
    }

    async createUser(dto: UserInterface): Promise<User | null>{
        const user = new User(dto);
        const newUser = await this.userModel.create(user);
        return newUser ? newUser.get({plain: true}): null;
    }

    async createUserSocial(data: any): Promise<UserSocial>{
        const newUserSocial = await this.userSocialModel.create(data);
        return newUserSocial ? newUserSocial.get({plain:true}): null;
    }
}