import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection, Like } from 'typeorm';
import { FindAllDto } from '../findAll.dto';
import { PromotorProductRepository } from '../promotor-product/promotor-product.repository';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { Return, ReturnStatus } from './entities/return.entity';
import { ReturnsRepository } from './returns.repository';

@Injectable()
export class ReturnsService {
  constructor(
    private returnsRepository: ReturnsRepository,
    private promotorProductRepository: PromotorProductRepository,
    private userRepository: UserRepository,
  ) {}
  async create(
    createReturnDto: CreateReturnDto,
    user: { id: number; role: string },
  ) {
    const { promotorProductId, date, description } = createReturnDto;

    const pp = await this.promotorProductRepository.findOne(promotorProductId, {
      relations: ['user', 'product'],
    });

    if (user.role === 'PROMOTOR' && pp.user.id !== user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: [`El producto que quieres devolver no te pertenece`],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (pp.cant_out + pp.cant_returned >= pp.cant) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: [
            `El producto que quieres devolver no tiene unidades disponibles`,
          ],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const cant = pp.cant - pp.cant_out;

    pp.cant_returned = cant;

    const returns = this.returnsRepository.create({ date, cant, description });
    returns.promotorProduct = pp;

    const returnsDb = await this.returnsRepository.save(returns);

    return returnsDb;
  }

  async findAll(user: { id: number; role: string }, query: FindAllDto) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'DESC';
    const column = query.column;
    let columnOrder = '';
    switch (column) {
      case 'date':
        columnOrder = 'returns.date';
        break;
      case 'promotor':
        columnOrder = 'user.name';
        break;
      case 'product':
        columnOrder = 'product.name';
        break;
      case 'status':
        columnOrder = 'returns.status';
        break;
      default:
        columnOrder = 'date';
        break;
    }

    const [data, count] = await getConnection()
      .createQueryBuilder(Return, 'returns')
      .leftJoinAndSelect('returns.promotorProduct', 'promotorProduct')
      .leftJoinAndSelect('promotorProduct.product', 'product')
      .leftJoin('promotorProduct.user', 'user')
      .where(user.role === 'PROMOTOR' ? `user.id = ${user.id}` : '')
      .andWhere('user.name ILIKE :name', { name: `%${keyword.toUpperCase()}%` })
      .addSelect('user.id')
      .addSelect('user.name')
      .addSelect('user.email')
      .limit(take)
      .offset(skip)
      .orderBy(columnOrder, sort)
      .getManyAndCount();
    return { data, count };
  }

  async findOne(id: number, user: { id: number; role: string }) {
    const returns = await this.returnsRepository.findOne(id, {
      relations: [
        'promotorProduct',
        'promotorProduct.product',
        'promotorProduct.user',
      ],
    });

    if (
      user.role === 'PROMOTOR' &&
      returns.promotorProduct.user.id !== user.id
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: [`El recurso que quieres ver no te pertenece`],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...returns,
      promotorProduct: {
        ...returns.promotorProduct,
        user: {
          id: returns.promotorProduct.user.id,
          name: returns.promotorProduct.user.name,
          email: returns.promotorProduct.user.email,
        },
      },
    };
  }

  async update(id: number, updateReturnDto: UpdateReturnDto, userId: number) {
    const { status, cancelled_description } = updateReturnDto;

    const returns = await this.returnsRepository.findOne(id, {
      relations: [
        'promotorProduct',
        'promotorProduct.product',
        'promotorProduct.user',
      ],
    });

    if (returns.status !== 'PENDIENTE') {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: [`La devolucion ya se encuntra aprobada o anulada`],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne(userId);

    if (status === 'APROBADO') {
      return this.changeToApprove(returns, status, user);
    }
    return this.changeToCancelled(returns, status, cancelled_description, user);
  }

  private async changeToCancelled(
    returns: Return,
    status: ReturnStatus,
    description: string,
    user: User,
  ) {
    if (!description) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: [`El campo cancelled_description es necesario`],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    returns.promotorProduct.cant_returned = 0;
    returns.status = status;
    returns.cancelled_description = description;
    returns.almacenero = user;
    const returnsdb = await this.returnsRepository.save(returns);
    return {
      ...returnsdb,
      promotorProduct: {
        ...returnsdb.promotorProduct,
        user: {
          id: returnsdb.promotorProduct.user.id,
          name: returnsdb.promotorProduct.user.name,
          email: returnsdb.promotorProduct.user.email,
        },
      },
    };
  }

  private async changeToApprove(
    returns: Return,
    status: ReturnStatus,
    user: User,
  ) {
    returns.status = status;
    returns.almacenero = user;
    const returnsdb = await this.returnsRepository.save(returns);
    return {
      ...returnsdb,
      promotorProduct: {
        ...returnsdb.promotorProduct,
        user: {
          id: returnsdb.promotorProduct.user.id,
          name: returnsdb.promotorProduct.user.name,
          email: returnsdb.promotorProduct.user.email,
        },
      },
    };
  }
}
