import { IsDateString, IsNotEmpty } from 'class-validator';
import { PromotorProduct } from 'src/modules/promotor-product/entities/promotor-product.entity';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';

export class CreateReturnDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  cant: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @ExistsOnDatabase(PromotorProduct)
  promotorProductId: number;
}
