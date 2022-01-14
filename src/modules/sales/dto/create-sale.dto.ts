import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  total: number;

  clientId: number;

  @IsNotEmpty()
  saleDetails: string;
}
