import { IsDateString, IsNotEmpty } from 'class-validator';
import { Product } from 'src/modules/products/entities/product.entity';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';

export class CreateLoteDto {
  @IsNotEmpty()
  @ExistsOnDatabase(Product)
  productId: number;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  cant: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  register: Date;

  @IsNotEmpty()
  @IsDateString()
  expiry: Date;
}
