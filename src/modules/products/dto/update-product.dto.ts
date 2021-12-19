import { IsNotEmpty } from 'class-validator';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Category } from 'src/modules/categories/entities/category.entity';

export class UpdateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  basePrice: number;

  @IsNotEmpty()
  salePrice: number;

  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  @ExistsOnDatabase(Category)
  categoryId: number;
}
