import { IsNotEmpty } from 'class-validator';
import { UniqueCode } from 'src/validations/unique-code';
import { Category } from '../entities/category.entity';

export class UpdateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  description: string;
}
