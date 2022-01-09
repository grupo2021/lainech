import { Injectable } from '@nestjs/common';
import { CreatePromotorProductDto } from './dto/create-promotor-product.dto';
import { UpdatePromotorProductDto } from './dto/update-promotor-product.dto';

@Injectable()
export class PromotorProductService {
  create(createPromotorProductDto: CreatePromotorProductDto) {
    return 'This action adds a new promotorProduct';
  }

  findAll() {
    return `This action returns all promotorProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promotorProduct`;
  }

  update(id: number, updatePromotorProductDto: UpdatePromotorProductDto) {
    return `This action updates a #${id} promotorProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotorProduct`;
  }
}
