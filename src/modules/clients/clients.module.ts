import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRepository } from './clientsRepository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRepository])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
