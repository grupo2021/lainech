import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { RolesGuard } from '../auth/authorization/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportService } from './report.service';

@Controller('report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @Roles(RoleOptions.Admin, RoleOptions.Almacenero)
  generateReport(@Body() reportDto: GenerateReportDto) {
    return this.reportService.generateReport(reportDto);
  }
}
