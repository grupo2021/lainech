import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Lote } from '../entities/lote.entity';

export class FindOneLoteDto {
  @ExistsOnDatabase(Lote)
  id: number;
}
