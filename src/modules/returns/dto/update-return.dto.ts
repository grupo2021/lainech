import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReturnStatus } from '../entities/return.entity';

export class UpdateReturnDto {
  @IsNotEmpty()
  @IsEnum(ReturnStatus)
  status: ReturnStatus;

  cancelled_description: string;
}
