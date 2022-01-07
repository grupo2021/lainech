import { RelationOptions } from 'typeorm';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReloadStatus } from '../entities/reload.entity';

export class UpdateReloadDto {
  @IsNotEmpty()
  @IsEnum(ReloadStatus, {
    message: 'status must be ANULADO, PENDIENTE, APROBADO',
  })
  status: ReloadStatus;
}
