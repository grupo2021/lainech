import { IsNotEmpty } from 'class-validator';

export class UpdateClientDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phones: string;
}
