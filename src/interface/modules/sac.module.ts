import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { SacController } from "../controllers/sac.controller";
import { SacRepository } from "../../infrastructure/repositories/sac.repository";
import { CreateContactUseCase } from "../../application/use-cases/sac/create-contact.use-case";
import { FindContactByIdUseCase } from "../../application/use-cases/sac/find-contact-by-id.use-case";
import { FindAllContactsUseCase } from "../../application/use-cases/sac/find-all-contacts.use-case";
import { UpdateContactStatusUseCase } from "../../application/use-cases/sac/update-contact-status.use-case";
import { DeleteContactUseCase } from "../../application/use-cases/sac/delete-contact.use-case";
import { CreateResponseUseCase } from "../../application/use-cases/sac/create-response.use-case";
import { AuthModule } from "./auth.module";

/** Módulo SAC – arquitetura Clean/Hexagonal. Ports IN → UseCase; Port OUT → Repository. */
@Module({
    imports: [
        SequelizeModule.forFeature(models),
        AuthModule
    ],
    controllers: [SacController],
    providers: [
        SacRepository,
        CreateContactUseCase,
        FindContactByIdUseCase,
        FindAllContactsUseCase,
        UpdateContactStatusUseCase,
        DeleteContactUseCase,
        CreateResponseUseCase,
        { provide: 'ICreateContactPort', useClass: CreateContactUseCase },
        { provide: 'IFindAllContactsPort', useClass: FindAllContactsUseCase },
        { provide: 'IFindContactByIdPort', useClass: FindContactByIdUseCase },
        { provide: 'IUpdateContactStatusPort', useClass: UpdateContactStatusUseCase },
        { provide: 'IDeleteContactPort', useClass: DeleteContactUseCase },
        { provide: 'ICreateResponsePort', useClass: CreateResponseUseCase },
        { provide: 'ISacRepository', useClass: SacRepository },
    ],
    exports: ['ISacRepository', SacRepository]
})
export class SacModule {}
