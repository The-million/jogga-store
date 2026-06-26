import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    UsersModule,
    AddressesModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    WishlistModule,
    DeliveryModule,
    WhatsAppModule,
    UploadsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
