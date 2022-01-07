import { Module } from '@nestjs/common';
import { ReloadService } from './reload.service';
import { ReloadController } from './reload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReloadRepository } from './reload.repository';
import { UserRepository } from '../user/user.repository';
import { ProductsRepository } from '../products/products.repository';
import { LoteRepository } from '../lote/lote.repository';
import { ReloadDetail } from './entities/reload_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReloadRepository,
      UserRepository,
      ProductsRepository,
      LoteRepository,
      ReloadDetail,
    ]),
  ],
  controllers: [ReloadController],
  providers: [ReloadService],
})
export class ReloadModule {}
