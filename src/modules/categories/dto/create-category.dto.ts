import { IsNotEmpty } from 'class-validator';
import { UniqueCode } from 'src/validations/unique-code';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @UniqueCode(Category)
  code: string;

  @IsNotEmpty()
  description: string;
}
