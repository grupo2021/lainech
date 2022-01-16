import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateLoteDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  cant: number;

  @IsNotEmpty()
  cant_out: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  register: Date;

  @IsNotEmpty()
  @IsDateString()
  expiry: Date;
}
