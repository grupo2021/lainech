import { Module } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { ReturnsRepository } from './returns.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotorProductRepository } from '../promotor-product/promotor-product.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReturnsRepository,
      PromotorProductRepository,
      UserRepository,
    ]),
  ],
  controllers: [ReturnsController],
  providers: [ReturnsService],
})
export class ReturnsModule {}
