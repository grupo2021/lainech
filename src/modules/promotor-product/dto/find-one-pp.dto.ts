import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { PromotorProduct } from '../entities/promotor-product.entity';

export class FindOnePPDto {
  @ExistsOnDatabase(PromotorProduct)
  id: number;
}
