import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { AuthModule } from "../../interface/modules/auth.module";
import { UserController } from "../../interface/controllers/user.controller";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { RoleRepository } from "../../infrastructure/repositories/role.repository";
import { CreateUserRegisterUseCase } from "../../application/use-cases/user/create-user-register.use-case";
import { FindUserByIdUseCase } from "../../application/use-cases/user/find-user-by-id.use-case";
import { UpdateUserByIdUseCase } from "../../application/use-cases/user/update-user-by-id.use-case";
import { FindUserAllUseCase } from "../../application/use-cases/user/find-user-all.use-case";
import { GenenerateHashUseCase } from "../../application/use-cases/auth/generate-hash.use-case";
import { ConfigService } from "@nestjs/config";

/**
 * Módulo User – arquitetura Clean/Hexagonal.
 * Ports IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    RoleRepository,
    CreateUserRegisterUseCase,
    FindUserByIdUseCase,
    UpdateUserByIdUseCase,
    FindUserAllUseCase,
    GenenerateHashUseCase,
    ConfigService,
    { provide: 'ICreateUserPort', useClass: CreateUserRegisterUseCase },
    { provide: 'IFindUserByIdPort', useClass: FindUserByIdUseCase },
    { provide: 'IFindUserAllPort', useClass: FindUserAllUseCase },
    { provide: 'IUpdateUserPort', useClass: UpdateUserByIdUseCase },
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IRoleRepository', useClass: RoleRepository },
  ],
  exports: ['IUserRepository', UserRepository],
})
export class UserModule {}
