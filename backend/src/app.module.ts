import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryModule } from './delivery/delivery.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { UploadsModule } from './uploads/uploads.module';
import { SettingsModule } from './settings/settings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, AuthModule, CategoriesModule, ProductsModule, CartModule, OrdersModule, DeliveryModule, WhatsAppModule, UploadsModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
