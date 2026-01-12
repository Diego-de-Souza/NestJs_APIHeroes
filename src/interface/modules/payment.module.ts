import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../../application/services/payment.service';
import { PaymentRepository } from '../../infrastructure/repositories/payment.repository';
import { PremiumGuard } from '../guards/premium.guard';
import { AuthModule } from './auth.module';
import { Subscription } from '../../infrastructure/database/sequelize/models/subscription.model';
import { Payment } from '../../infrastructure/database/sequelize/models/payment.model';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([Subscription, Payment, ...models]),
    AuthModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    PremiumGuard,
    UserRepository
  ],
  exports: [PaymentService, PaymentRepository, PremiumGuard]
})
export class PaymentModule {}
