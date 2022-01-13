import { IsNotEmpty } from 'class-validator';

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
}
