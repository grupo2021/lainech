import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Category } from '../entities/category.entity';

export class FindOneCategoryDto {
  @ExistsOnDatabase(Category)
  id: number;
}
