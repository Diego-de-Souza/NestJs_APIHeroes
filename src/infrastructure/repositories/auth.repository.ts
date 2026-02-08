import { InjectModel } from "@nestjs/sequelize";
import {User, UserSocial, Validation } from "../database/sequelize/models/index.model";
import { Injectable } from "@nestjs/common";
import { Role } from "../database/sequelize/models/roles.model";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { Op } from "sequelize";

@Injectable()
export class AuthRepository {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        @InjectModel(UserSocial) private readonly userSocialModel: typeof UserSocial,
        @InjectModel(Validation) private readonly validationModel: typeof Validation,
    ){}

    async findByEmail(email: string): Promise<User>{
        return await this.userModel.findOne({where: {firstemail: email}}) 
    }

    async findRoleByUserId(usuario_id: string): Promise<Role>{
        return await this.roleModel.findOne({where: {usuario_id}});
    }

    async findUserById(id:string): Promise<User>{
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

    async saveSecretTOTP(userId: string, secret: string): Promise<void>{
        await this.userModel.update(
            { totp_secret: secret },
            { where: { id: userId } }
        );
    }

    async saveMfaCode(userId: string, secret: string): Promise<void>{
        await this.userModel.update(
            { mfa_secret: secret },
            { where: { id: userId } }
        );
    }

    //depois de analisar, talvez seja melhor criar uma tabela separada para armazenar os códigos de redefinição de senha
    async saveCodePassword(data: string, secret: string): Promise<void>{
        const whereClause = data.includes('@') ? { firstemail: data } : { cellphone: data };
        await this.userModel.update(
            { mfa_secret: secret },
            { where: whereClause }
        );
    }

    async deleteTotpSecret(userId: string): Promise<boolean> {
        const [numberOfAffectedRows] = await this.userModel.update(
            { totp_secret: null },
            { where: { id: userId, totp_secret: { [Op.ne]: null } } }
        );
        return numberOfAffectedRows > 0;
    }

    async createValidation(data: any): Promise<any>{
        return await this.validationModel.create(data);
    }

    async findValidationByTokenId(sessionToken): Promise<Validation | null>{
        return await this.validationModel.findOne({
            where: {
                token_id: sessionToken,
                is_active: true
            }});
    }

    async deactivateValidation(sessionToken): Promise<void>{
        await this.validationModel.update(
            { is_active: false },
            { where: { token_id: sessionToken } }
        );
    }

    async updateValidationLastUsed(sessionToken): Promise<void>{
        await this.validationModel.update(
            { last_used_at: new Date() },
            { where: { token_id: sessionToken } }
        );
    }

    async deleteAllUserValidations(userId: string): Promise<number>{
        return await this.validationModel.destroy({
            where: {
                user_id: userId
            }
        })
    }

    async deleteValidationByTokenId(sessionToken): Promise<number>{
        return await this.validationModel.destroy({
            where: {
                token_id: sessionToken
            }
        });
    }

    async deleteExpiredValidations(cutoffDate: Date): Promise<number>{
        return await this.validationModel.destroy({
            where: {
                expires_at:{
                    [Op.lt]: new Date()
                }
            }
        });
    }

    async deleteValidationById(id: string): Promise<number>{
        return await this.validationModel.destroy({
            where: {
                id: id
            }
        });
    }

    async findValidationsByUserId(userId: string): Promise<Validation[]>{
        return await this.validationModel.findAll({
            where: {
                user_id: userId,
                is_active: true
            }
        });
    }

    async updateValidationToken(
        tokenId: string, 
        newAccessToken: string, 
        newRefreshToken: string, 
        newExpiresAt: Date
    ): Promise<void> {
        const [affectedRows] = await this.validationModel.update(
            {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                expires_at: newExpiresAt,
                last_used_at: new Date(),
                updated_at: new Date()
            },
            {
                where: { 
                    token_id: tokenId, 
                    is_active: true 
                }
            }
        );

        if (affectedRows === 0) {
            throw new Error('Sessão não encontrada para atualização');
        }
    }

    async findValidationByRefreshToken(refreshToken: string): Promise<Validation | null> {
        return await this.validationModel.findOne({
            where: {
                refresh_token: refreshToken,
                is_active: true
            }
        });
    }

    async forgotPassword(email: string, birthdate: string, cpf: string): Promise<User | null>{
        return await this.userModel.findOne({
            where: {
                firstemail: email,
                birthdate: birthdate,
                cpf: cpf
            }
        });
    }
}