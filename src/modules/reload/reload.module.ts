import { Module } from '@nestjs/common';
import { ReloadService } from './reload.service';
import { ReloadController } from './reload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReloadRepository } from './reload.repository';
import { UserRepository } from '../user/user.repository';
import { ProductsRepository } from '../products/products.repository';
import { ReloadDetailRepository } from './reload_detail.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReloadRepository,
      UserRepository,
      ProductsRepository,
      ReloadDetailRepository,
    ]),
  ],
  controllers: [ReloadController],
  providers: [ReloadService],
})
export class ReloadModule {}
