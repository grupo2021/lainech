import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection, Like } from 'typeorm';
import { FindAllDto } from '../findAll.dto';
import { Lote } from '../lote/entities/lote.entity';
import { LoteRepository } from '../lote/lote.repository';
import { ProductsRepository } from '../products/products.repository';
import { PromotorProductRepository } from '../promotor-product/promotor-product.repository';
import { UserRepository } from '../user/user.repository';
import { CreateReloadDto } from './dto/create-reload.dto';
import { UpdateReloadDto } from './dto/update-reload.dto';
import { Reload, ReloadStatus } from './entities/reload.entity';
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
    private loteRepository: LoteRepository,
    private promotorProductRespository: PromotorProductRepository,
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
      const product = await this.productRepository.findOne(productId, {
        relations: ['category'],
      });
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

  async findAllByUserWithPagination(query: FindAllDto, userId: number) {
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
      .andWhere('user.id = :id', { id: userId })
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
      relations: [
        'user',
        'reloadDetails',
        'reloadDetails.product',
        'reloadDetails.product.category',
      ],
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
      relations: [
        'user',
        'reloadDetails',
        'reloadDetails.product',
        'reloadDetails.product.category',
      ],
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

  async changeToApprove(reloadId: number) {
    const reload = await this.reloadRepository.findOne(reloadId, {
      relations: [
        'user',
        'reloadDetails',
        'reloadDetails.product',
        'reloadDetails.product.category',
        'reloadDetails.product.lotes',
      ],
    });

    if (reload.status !== ReloadStatus.PENDIENTE) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: ['La recarga ya se encuentra en estado APROBADO o ANULADO'],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const errors = this.findErrorsOnDetails(reload.reloadDetails);

    if (errors.length) {
      this.throwErrors(errors);
    }

    try {
      for (let i = 0; i < reload.reloadDetails.length; i++) {
        const detail = reload.reloadDetails[i];
        const lotesAct = this.generateLotesToUpdate(
          detail.product.lotes,
          detail.cant,
        );
        //TODO: cambiar la forma a transaccion
        for (let j = 0; j < lotesAct.length; j++) {
          const { createdAt, updatedAt, product, ...rest } = lotesAct[j];
          await this.loteRepository.save(rest);
        }

        //TODO: crear o actualizar promotor_products
        const promotorProduct = await this.promotorProductRespository.findOne({
          where: { product: detail.product },
        });

        if (promotorProduct) {
          promotorProduct.cant = promotorProduct.cant + detail.cant;
          await this.promotorProductRespository.save(promotorProduct);
        } else {
          const newPromotorProduct = this.promotorProductRespository.create({
            cant: detail.cant,
            product: detail.product,
            user: reload.user,
          });
          await this.promotorProductRespository.save(newPromotorProduct);
        }
      }
      reload.status = ReloadStatus.APROBADO;
      return this.reloadRepository.save(reload);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: ['Ocuccio un error de nuestro lado'],
          error: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeToCancelled(reloadId: number) {
    const reload = await this.reloadRepository.findOne(reloadId, {
      relations: [
        'user',
        'reloadDetails',
        'reloadDetails.product',
        'reloadDetails.product.category',
      ],
    });
    reload.status = ReloadStatus.ANULADO;
    return this.reloadRepository.save(reload);
  }

  private findErrorsOnDetails(details: ReloadDetail[]) {
    const res: { availableCant: number; detail: ReloadDetail }[] = [];
    for (let i = 0; i < details.length; i++) {
      const { product, cant: necessaryCant } = details[i];
      const availableCant = product.lotes
        .map((l) => ({ cant: l.cant, count_out: l.cant_out }))
        .reduce((counter, item) => counter + (item.cant - item.count_out), 0);
      if (necessaryCant > availableCant) {
        res.push({ availableCant, detail: details[i] });
      }
    }

    return res;
  }

  private throwErrors(
    errors: { availableCant: number; detail: ReloadDetail }[],
  ) {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        messages: errors.map(
          (e) =>
            `El producto ${e.detail.product.name} tiene ${e.availableCant} unidades disponibles y es necesario  ${e.detail.cant} unidades`,
        ),
        error: 'Bad request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  private generateLotesToUpdate(lotes: Lote[], cantNeeded: number) {
    const lotesSort = this.sortLotes(lotes);

    const lotesToUpdate: Lote[] = [];

    let count = 0;
    let cant = cantNeeded;
    while (cant > 0 && count < lotesSort.length) {
      const lote = lotes[count];

      if (lote.cant >= lote.cant_out + cant) {
        lote.cant_out = lote.cant_out + cant;
        cant = 0;
        //colocar al arr
        lotesToUpdate.push(lote);
      } else if (cant > 0 && lote.cant > lote.cant_out) {
        const rest = lote.cant - lote.cant_out;
        lote.cant_out = lote.cant_out + rest;
        cant = cant - rest;
        //colorar al arr;
        lotesToUpdate.push(lote);
      }

      count++;
    }
    return lotesToUpdate;
  }

  private sortLotes(lotes: Lote[]) {
    return lotes.sort((a, b) => a.register.getTime() - b.register.getTime());
  }
}
