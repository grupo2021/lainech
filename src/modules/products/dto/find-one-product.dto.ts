import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Product } from '../entities/product.entity';

export class FindOneProductDto {
  @ExistsOnDatabase(Product)
  id: number;
}
