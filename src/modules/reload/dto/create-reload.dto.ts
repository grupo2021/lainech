import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateReloadDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  details: string;
}
