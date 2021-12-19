import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/modules/categories/entities/category.entity';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { UniqueCode } from 'src/validations/unique-code';
import { Product } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @UniqueCode(Product)
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
