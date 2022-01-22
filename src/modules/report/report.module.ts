import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesRepository } from '../sales/sales.repository';
import { ReloadRepository } from '../reload/reload.repository';
import { ReturnsRepository } from '../returns/returns.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesRepository,
      ReloadRepository,
      ReturnsRepository,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
