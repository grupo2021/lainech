import { Injectable } from '@nestjs/common';
import { getConnection, Like } from 'typeorm';
import { FindAllDto } from '../findAll.dto';
import { ProductsRepository } from '../products/products.repository';
import { UserRepository } from '../user/user.repository';
import { CreateReloadDto } from './dto/create-reload.dto';
import { UpdateReloadDto } from './dto/update-reload.dto';
import { Reload } from './entities/reload.entity';
import { ReloadDetail } from './entities/reload_detail.entity';
import { ReloadRepository } from './reload.repository';
import { ReloadDetailRepository } from './reload_detail.repository';

@Injectable()
export class ReloadService {
  constructor(
    private userRepository: UserRepository,
    private reloadRepository: ReloadRepository,
    private reloadDetailRepository: ReloadDetailRepository,
    private productRepository: ProductsRepository,
  ) {}

  async create(createReloadDto: CreateReloadDto, userId: number) {
    const { details: det } = createReloadDto;

    const details = JSON.parse(det) || [];
    const detailsArr = details as {
      productId: number;
      cant: number;
      subtotal: number;
    }[];

    const reload = this.reloadRepository.create(createReloadDto);

    const user = await this.userRepository.findOne(userId);
    const reloadDetails: ReloadDetail[] = [];
    for (let i = 0; i < detailsArr.length; i++) {
      const { cant, subtotal, productId } = detailsArr[i];
      const product = await this.productRepository.findOne(productId);
      const reloadDetail = this.reloadDetailRepository.create({
        cant,
        subtotal,
        product,
      });
      reloadDetails.push(reloadDetail);
    }

    reload.user = user;
    reload.reloadDetails = reloadDetails;

    return this.reloadRepository.save(reload);
  }

  async findAllWithPagination(query: FindAllDto) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'DESC';
    const column = query.column;
    let columnOrder = '';
    switch (column) {
      case 'date':
        columnOrder = 'reload.date';
        break;
      case 'promotor':
        columnOrder = 'user.name';
        break;
      case 'total':
        columnOrder = 'reload.total';
        break;
      case 'status':
        columnOrder = 'reload.status';
        break;
      default:
        columnOrder = 'reload.date';
        break;
    }

    const [data, count] = await getConnection()
      .createQueryBuilder(Reload, 'reload')
      .leftJoin('reload.user', 'user')
      .where('user.name ILIKE :name', { name: `%${keyword.toUpperCase()}%` })
      .addSelect('user.id')
      .addSelect('user.name')
      .addSelect('user.email')
      .limit(take)
      .offset(skip)
      .orderBy(columnOrder, sort)
      .getManyAndCount();

    return { data, count };
  }

  async findOne(id: number) {
    const reload = await this.reloadRepository.findOne(id, {
      relations: ['user', 'reloadDetails', 'reloadDetails.product'],
    });

    return {
      ...reload,
      user: {
        id: reload.user.id,
        name: reload.user.name,
        email: reload.user.email,
      },
    };
  }

  async update(id: number, updateReloadDto: UpdateReloadDto) {
    const reload = await this.reloadRepository.findOne(id, {
      relations: ['user'],
    });
    reload.status = updateReloadDto.status;
    const newReload = await this.reloadRepository.save(reload);
    return {
      ...newReload,
      user: {
        id: newReload.user.id,
        name: newReload.user.name,
        email: newReload.user.email,
      },
    };
  }

  remove(id: number) {
    return `This action is not implemented`;
  }
}
