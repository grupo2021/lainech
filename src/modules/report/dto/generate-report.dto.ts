import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';

export enum ReportType {
  RECARGAS = 'RECARGAS',
  VENTAS = 'VENTAS',
}

export class GenerateReportDto {
  @IsNotEmpty()
  @IsEnum(ReportType)
  type: ReportType;

  @IsNotEmpty()
  @IsDateString()
  initDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @ExistsOnDatabase(User)
  userId: number;
}
