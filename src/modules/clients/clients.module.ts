import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRepository } from './clientsRepository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRepository, UserRepository])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
