import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Return } from '../entities/return.entity';

export class FindOneReturnDto {
  @ExistsOnDatabase(Return)
  id: number;
}
