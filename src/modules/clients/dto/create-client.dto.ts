import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClientTypes } from '../entities/client.entity';

export class CreateClientDto {
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
  person_charge: string;

  @IsNotEmpty()
  phone_person_charge: string;
}
