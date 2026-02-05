import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { EventsController } from "../controllers/events.controller";
import { EventsRepository } from "../../infrastructure/repositories/events.repository";
import { FindEventsUseCase } from "../../application/use-cases/events/find-events.use-case";
import { DeleteEventsUseCase } from "../../application/use-cases/events/delete-event.use-case";
import { CreateRegisterEventsUseCase } from "../../application/use-cases/events/create-register-events.use-case";
import { ImageService } from "../../application/services/image.service";
import { ConverterImageUseCase } from "../../application/use-cases/images/converter-image.use-case";
import { FindEventsListHomeUseCase } from "../../application/use-cases/events/find-events-list-home.use-case";

@Module({
    imports: [SequelizeModule.forFeature(models)],
    controllers: [EventsController],
    providers: [
        ImageService,
        ConverterImageUseCase,
        EventsRepository,
        { provide: 'ICreateEventPort', useClass: CreateRegisterEventsUseCase },
        { provide: 'IFindEventsPort', useClass: FindEventsUseCase },
        { provide: 'IDeleteEventPort', useClass: DeleteEventsUseCase },
        { provide: 'IFindEventsListHomePort', useClass: FindEventsListHomeUseCase },
        { provide: 'IEventsRepository', useClass: EventsRepository },
    ],
})
export class EventsModule {}
