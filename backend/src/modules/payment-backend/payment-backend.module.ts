import { Module } from '@nestjs/common';
import { PaymentBackendService } from './payment-backend.service';
import { PaymentBackendController } from './payment-backend.controller';

@Module({
  providers: [PaymentBackendService],
  controllers: [PaymentBackendController],
})
export class PaymentBackendModule {}
