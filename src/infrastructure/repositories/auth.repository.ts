import { InjectModel } from "@nestjs/sequelize";
import { User } from "../database/sequelize/models/user.model";
import { Injectable } from "@nestjs/common";
import { Role } from "../database/sequelize/models/roles.model";
import { UserSocial } from "../database/sequelize/models/user-social.model";
import { UserInterface } from "src/domain/interfaces/user.interface";
import { Op } from "sequelize";

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

    async saveSecretTOTP(userId: number, secret: string): Promise<void>{
        await this.userModel.update(
            { totp_secret: secret },
            { where: { id: userId } }
        );
    }

    async saveMfaCode(userId: number, secret: string): Promise<void>{
        await this.userModel.update(
            { mfa_secret: secret },
            { where: { id: userId } }
        );
    }

    async saveCodePassword(data: string, secret: string): Promise<void>{
        const whereClause = data.includes('@') ? { firstemail: data } : { cellphone: data };
        await this.userModel.update(
            { mfa_secret: secret },
            { where: whereClause }
        );
    }

    async deleteTotpSecret(userId: number): Promise<boolean> {
        const [numberOfAffectedRows] = await this.userModel.update(
            { totp_secret: null },
            { where: { id: userId, totp_secret: { [Op.ne]: null } } }
        );
        return numberOfAffectedRows > 0;
    }
}