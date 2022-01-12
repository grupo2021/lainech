import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { SalesRepository } from '../sales/sales.repository';
import { ReloadRepository } from '../reload/reload.repository';
import { ClientRepository } from '../clients/clientsRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      SalesRepository,
      ReloadRepository,
      ClientRepository,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
