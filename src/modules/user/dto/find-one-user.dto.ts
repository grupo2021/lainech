import { ExistsOnDatabase } from '../../../validations/exists-on-database';
import { User } from '../entities/user.entity';

export class FindOneUserDto {
  @ExistsOnDatabase(User)
  id: number;
}
