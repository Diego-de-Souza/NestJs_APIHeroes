import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "../user/user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from 'src/models/index.model';
import { AuthModule } from "../auth/auth.module";
import { MulterModule } from "@nestjs/platform-express/multer";

@Module({
    imports: [
        SequelizeModule.forFeature(models), 
        AuthModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}