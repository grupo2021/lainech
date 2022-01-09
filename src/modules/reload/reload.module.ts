import { Module } from '@nestjs/common';
import { ReloadService } from './reload.service';
import { ReloadController } from './reload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReloadRepository } from './reload.repository';
import { UserRepository } from '../user/user.repository';
import { ProductsRepository } from '../products/products.repository';
import { ReloadDetailRepository } from './reload_detail.repository';
import { LoteRepository } from '../lote/lote.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReloadRepository,
      UserRepository,
      ProductsRepository,
      ReloadDetailRepository,
      LoteRepository,
    ]),
  ],
  controllers: [ReloadController],
  providers: [ReloadService],
})
export class ReloadModule {}
