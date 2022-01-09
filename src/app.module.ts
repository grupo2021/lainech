import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ClientsModule } from './modules/clients/clients.module';
import { LoteModule } from './modules/lote/lote.module';
import { ReloadModule } from './modules/reload/reload.module';
import { PromotorProductModule } from './modules/promotor-product/promotor-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    RoleModule,
    UserModule,
    AuthModule,
    ProfileModule,
    CategoriesModule,
    ProductsModule,
    ClientsModule,
    LoteModule,
    ReloadModule,
    PromotorProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
