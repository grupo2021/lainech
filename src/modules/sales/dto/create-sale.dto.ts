import { IsDateString, IsNotEmpty } from 'class-validator';
import { Client } from 'src/modules/clients/entities/client.entity';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  @ExistsOnDatabase(Client)
  clientId: number;

  @IsNotEmpty()
  saleDetails: string;
}
