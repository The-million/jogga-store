import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryGateway } from './delivery.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryGateway],
  exports: [DeliveryService, DeliveryGateway],
})
export class DeliveryModule {}
