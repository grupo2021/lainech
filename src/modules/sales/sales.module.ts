import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesRepository } from './sales.repository';
import { ClientRepository } from '../clients/clientsRepository';
import { SalesDetailsRepository } from './sales-details.repository';
import { PromotorProductRepository } from '../promotor-product/promotor-product.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientRepository,
      PromotorProductRepository,
      SalesRepository,
      SalesDetailsRepository,
      UserRepository,
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
