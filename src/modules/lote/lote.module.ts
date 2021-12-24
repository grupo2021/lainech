import { Module } from '@nestjs/common';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoteRepository } from './lote.repository';
import { ProductsRepository } from '../products/products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LoteRepository, ProductsRepository])],
  controllers: [LoteController],
  providers: [LoteService],
})
export class LoteModule {}
