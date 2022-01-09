import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotorProductService } from './promotor-product.service';
import { CreatePromotorProductDto } from './dto/create-promotor-product.dto';
import { UpdatePromotorProductDto } from './dto/update-promotor-product.dto';

@Controller('promotor-product')
export class PromotorProductController {
  constructor(private readonly promotorProductService: PromotorProductService) {}

  @Post()
  create(@Body() createPromotorProductDto: CreatePromotorProductDto) {
    return this.promotorProductService.create(createPromotorProductDto);
  }

  @Get()
  findAll() {
    return this.promotorProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotorProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromotorProductDto: UpdatePromotorProductDto) {
    return this.promotorProductService.update(+id, updatePromotorProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotorProductService.remove(+id);
  }
}
