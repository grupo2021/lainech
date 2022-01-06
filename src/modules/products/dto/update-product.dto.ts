import { IsNotEmpty } from 'class-validator';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Category } from 'src/modules/categories/entities/category.entity';

export class UpdateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  profit: number;

  @IsNotEmpty()
  @ExistsOnDatabase(Category)
  categoryId: number;
}
