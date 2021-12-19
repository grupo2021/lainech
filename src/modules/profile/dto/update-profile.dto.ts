import { IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';

export class UpdateProfileDto {
  @IsNotEmpty()
  @ExistsOnDatabase(User)
  userId: number;

  @IsNotEmpty()
  name: string;

  surname: string;

  phones: string;

  address: string;

  identificationNumber: string;
}
