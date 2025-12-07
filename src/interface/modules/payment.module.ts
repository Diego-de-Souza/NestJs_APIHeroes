// src/payments/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentController } from '../../interface/controllers/payment.controller';
import { PaymentService } from '../../application/services/payment.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
