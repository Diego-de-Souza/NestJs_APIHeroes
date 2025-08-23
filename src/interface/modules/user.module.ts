import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { AuthModule } from "../../interface/modules/auth.module";
import { UserController } from "../controllers/user.controller";
import { UserService } from "src/application/services/user.service";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { CreateUserRegisterUseCase } from "src/application/use-cases/user/create-user-register.use-case";
import { FindUserByIdUseCase } from "src/application/use-cases/user/find-user-by-id.use-case";
import { UpdateUserByIdUseCase } from "src/application/use-cases/user/update-user-by-id.use-case";
import { FindUserAllUseCase } from "src/application/use-cases/user/find-user-all.use-case";
import { RoleService } from "src/application/services/role.service";
import { RoleRepository } from "src/infrastructure/repositories/role.repository";
import { GenenerateHashUseCase } from "src/application/use-cases/auth/generate-hash.use-case";
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