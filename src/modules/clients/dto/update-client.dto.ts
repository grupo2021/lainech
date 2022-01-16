import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClientSalePoint, ClientTypes } from '../entities/client.entity';

export class UpdateClientDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phones: string;

  @IsNotEmpty()
  identification_number: string;

  @IsNotEmpty()
  trade_name: string;

  @IsNotEmpty()
  @IsEnum(ClientTypes)
  type: ClientTypes;

  @IsNotEmpty()
  @IsEnum(ClientSalePoint)
  sale_point: ClientSalePoint;

  person_charge: string;

  phone_person_charge: string;
}
