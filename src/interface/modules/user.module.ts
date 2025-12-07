import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { AuthModule } from "../../interface/modules/auth.module";
import { UserController } from "../../interface/controllers/user.controller";
import { UserService } from "../../application/services/user.service";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { CreateUserRegisterUseCase } from "../../application/use-cases/user/create-user-register.use-case";
import { FindUserByIdUseCase } from "../../application/use-cases/user/find-user-by-id.use-case";
import { UpdateUserByIdUseCase } from "../../application/use-cases/user/update-user-by-id.use-case";
import { FindUserAllUseCase } from "../../application/use-cases/user/find-user-all.use-case";
import { RoleService } from "../../application/services/role.service";
import { RoleRepository } from "../../infrastructure/repositories/role.repository";
import { GenenerateHashUseCase } from "../../application/use-cases/auth/generate-hash.use-case";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        SequelizeModule.forFeature(models),
        forwardRef(() => AuthModule)
    ],
    controllers: [UserController],
    providers: [
        UserService,
        CreateUserRegisterUseCase,
        FindUserByIdUseCase,
        UpdateUserByIdUseCase,
        FindUserAllUseCase,
        GenenerateHashUseCase,
        ConfigService,
        UserRepository,
        RoleService,
        RoleRepository
    ],
    exports: [UserService]
})
export class UserModule {}