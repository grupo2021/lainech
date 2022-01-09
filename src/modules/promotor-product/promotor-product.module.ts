import { Module } from '@nestjs/common';
import { PromotorProductService } from './promotor-product.service';
import { PromotorProductController } from './promotor-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { ProductsRepository } from '../products/products.repository';
import { PromotorProductRepository } from './promotor-product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      ProductsRepository,
      PromotorProductRepository,
    ]),
  ],
  controllers: [PromotorProductController],
  providers: [PromotorProductService],
})
export class PromotorProductModule {}
