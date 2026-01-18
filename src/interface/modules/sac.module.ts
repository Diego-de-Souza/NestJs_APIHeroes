import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { SacController } from "../controllers/sac.controller";
import { SacService } from "../../application/services/sac.service";
import { SacRepository } from "../../infrastructure/repositories/sac.repository";
import { CreateContactUseCase } from "../../application/use-cases/sac/create-contact.use-case";
import { FindContactsByUserIdUseCase } from "../../application/use-cases/sac/find-contacts-by-user-id.use-case";
import { FindContactByIdUseCase } from "../../application/use-cases/sac/find-contact-by-id.use-case";
import { FindAllContactsUseCase } from "../../application/use-cases/sac/find-all-contacts.use-case";
import { UpdateContactStatusUseCase } from "../../application/use-cases/sac/update-contact-status.use-case";
import { DeleteContactUseCase } from "../../application/use-cases/sac/delete-contact.use-case";
import { CreateResponseUseCase } from "../../application/use-cases/sac/create-response.use-case";
import { AuthModule } from "./auth.module";

@Module({
    imports: [
        SequelizeModule.forFeature(models),
        AuthModule
    ],
    controllers: [SacController],
    providers: [
        SacService,
        SacRepository,
        CreateContactUseCase,
        FindContactsByUserIdUseCase,
        FindContactByIdUseCase,
        FindAllContactsUseCase,
        UpdateContactStatusUseCase,
        DeleteContactUseCase,
        CreateResponseUseCase
    ],
    exports: [SacService]
})
export class SacModule {}
