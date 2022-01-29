import { IsNotEmpty } from 'class-validator';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { User } from '../entities/user.entity';

export class RenewUserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @ExistsOnDatabase(User)
  userId: number;
}
