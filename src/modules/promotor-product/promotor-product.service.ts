import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { FindAllDto } from '../findAll.dto';
import { UserRepository } from '../user/user.repository';
import { PromotorProduct } from './entities/promotor-product.entity';
import { PromotorProductRepository } from './promotor-product.repository';

@Injectable()
export class PromotorProductService {
  constructor(
    private promotorProductRepository: PromotorProductRepository,
    private userRepository: UserRepository,
  ) {}

  async findAllByUserWithPagination(query: FindAllDto, userId: number) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'DESC';
    const column = query.column;
    let columnOrder = '';
    switch (column) {
      case 'updatedAt':
        columnOrder = 'promotorProduct.updatedAt';
        break;
      case 'product':
        columnOrder = 'product.name';
      case 'cant':
        columnOrder = 'promotorProduct.cant';
      case 'cant_out':
        columnOrder = 'promotorProduct.cant_out';
        break;
      default:
        columnOrder = 'promotorProduct.updatedAt';
        break;
    }

    const [data, count] = await getConnection()
      .createQueryBuilder(PromotorProduct, 'promotorProduct')
      .leftJoin('promotorProduct.user', 'user')
      .leftJoin('promotorProduct.product', 'product')
      .leftJoin('product.category', 'category')
      .where('product.name ILIKE :name', { name: `%${keyword.toUpperCase()}%` })
      .andWhere('user.id = :id', { id: userId })
      .addSelect('product.id')
      .addSelect('product.name')
      .addSelect('product.image')
      .addSelect('product.description')
      .addSelect('product.price')
      .addSelect('product.code')
      .addSelect('product.profit')
      .addSelect('category.id')
      .addSelect('category.name')
      .addSelect('category.code')
      .addSelect('category.createdAt')
      .addSelect('category.updatedAt')
      .addSelect('category.description')
      .limit(take)
      .offset(skip)
      .orderBy(columnOrder, sort)
      .getManyAndCount();

    return { data, count };
  }

  async findAllByUser(userId: number) {
    const user = await this.userRepository.findOne(userId);
    const products = await this.promotorProductRepository.find({
      where: { user },
      relations: ['product', 'product.category'],
    });
    return products;
  }

  async findOne(id: number, userId: number) {
    const user = await this.userRepository.findOne(userId);

    const pp = await this.promotorProductRepository.findOne(id, {
      relations: ['product', 'user', 'product.category'],
    });

    if (pp.user.id !== user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: ['Este recurso no te pertenece'],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return { ...pp, user: undefined };
  }
}
