import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export enum ReportType {
  RECARGAS = 'RECARGAS',
  VENTAS = 'VENTAS',
  RETURNS = 'RETURNS',
  BEST = 'BEST',
  PRODUCT = 'BEST-PRODUCT',
}

export enum ReportStatus {
  ALL = 'ALL',
  ANULADO = 'ANULADO',
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
}

export class GenerateReportDto {
  @IsNotEmpty()
  @IsEnum(ReportType)
  type: ReportType;

  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsNotEmpty()
  @IsDateString()
  initDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  userId: number;
}
