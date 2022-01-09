import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotorProductDto } from './create-promotor-product.dto';

export class UpdatePromotorProductDto extends PartialType(CreatePromotorProductDto) {}
