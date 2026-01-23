import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { CuriositiesController } from "../controllers/curiosities.Controller";
import { CuriosityService } from "../../application/services/curiosities.service";
import { CuriosityRepository } from "../../infrastructure/repositories/curiosities.repository";
import { CreateCuriosityUseCase } from "../../application/use-cases/curiosities/create-curiosities.use-case";
import { DeleteCuriosityUseCase } from "../../application/use-cases/curiosities/delete-curiosity.use-case";
import { FindAllCuriositiesUseCase } from "../../application/use-cases/curiosities/find-all-curiosities.use-case";
import { FindCuriosityByIdUseCase } from "../../application/use-cases/curiosities/find-curiosities-by-id.use-case";
import { UpdateCuriosityUseCase } from "../../application/use-cases/curiosities/update-curiosities.use-case";
import { AuthModule } from "./auth.module";


@Module({
    imports: [
        SequelizeModule.forFeature(models),
        AuthModule
    ],
    controllers: [CuriositiesController],
    providers: [
        CuriosityService,
        CreateCuriosityUseCase,
        UpdateCuriosityUseCase,
        FindCuriosityByIdUseCase,
        FindAllCuriositiesUseCase,
        DeleteCuriosityUseCase,
        CuriosityRepository
    ],
    exports: [CuriosityService]
})
export class CuriosidadesModule {}