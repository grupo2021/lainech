import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { LoteRepository } from './lote.repository';

@Injectable()
export class LoteService {
  constructor(
    private loteRepository: LoteRepository,
    private productRepository: ProductsRepository,
  ) {}
  async create(createLoteDto: CreateLoteDto) {
    const { productId: id } = createLoteDto;
    const product = await this.productRepository.findOne(id);
    const lote = this.loteRepository.create(createLoteDto);
    lote.product = product;
    const data = await this.loteRepository.save(lote);
    return { ...data, product: undefined };
  }

  findAll() {
    return this.loteRepository.find();
  }

  findOne(id: number) {
    return this.loteRepository.findOne(id);
  }

  async update(id: number, updateLoteDto: UpdateLoteDto) {
    const lote = await this.loteRepository.findOne(id);
    this.loteRepository.merge(lote, updateLoteDto);
    return this.loteRepository.save(lote);
  }

  async remove(id: number) {
    const lote = await this.loteRepository.findOne(id);
    await this.loteRepository.delete(id);
    return lote;
  }
}
