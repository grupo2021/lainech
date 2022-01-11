import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Sale } from '../entities/sale.entity';

export class FindOneSaleDto {
  @ExistsOnDatabase(Sale)
  id: number;
}
