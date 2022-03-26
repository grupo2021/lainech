import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { ClientRepository } from '../clients/clientsRepository';
import { FindAllDto } from '../findAll.dto';
import { PromotorProduct } from '../promotor-product/entities/promotor-product.entity';
import { PromotorProductRepository } from '../promotor-product/promotor-product.repository';
import { UserRepository } from '../user/user.repository';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleDetail } from './entities/sale-details.entity';
import { Sale, SaleStatus } from './entities/sale.entity';
import { SalesDetailsRepository } from './sales-details.repository';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(
    private saleRepository: SalesRepository,
    private clientRepository: ClientRepository,
    private promotorProductRespository: PromotorProductRepository,
    private saleDetailsRepository: SalesDetailsRepository,
    private userRepository: UserRepository,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: number) {
    const { clientId, saleDetails, date, total } = createSaleDto;

    const sale = this.saleRepository.create({ date, total });

    const saleDetailsArr = JSON.parse(saleDetails) as {
      promotorProductId: number;
      subtotal: number;
      cant: number;
      unitPrice: number;
    }[];

    const saleDetailsEntity: SaleDetail[] = [];

    for (let i = 0; i < saleDetailsArr.length; i++) {
      const { promotorProductId, cant, subtotal, unitPrice } =
        saleDetailsArr[i];
      const pp = await this.promotorProductRespository.findOne(
        promotorProductId,
      );
      const detail = this.saleDetailsRepository.create({
        cant,
        subtotal,
        precio_unitario: unitPrice,
        promotorProduct: pp,
      });
      saleDetailsEntity.push(detail);
    }

    if (clientId) {
      sale.client = await this.clientRepository.findOne(clientId);
    }

    sale.user = await this.userRepository.findOne(userId);
    sale.saleDetails = saleDetailsEntity;
    const saledb = await this.saleRepository.save(sale);

    return saledb;
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
        columnOrder = 'sale.date';
        break;
      case 'promotor':
        columnOrder = 'user.name';
        break;
      case 'total':
        columnOrder = 'sale.total';
        break;
      case 'status':
        columnOrder = 'sale.status';
        break;
      default:
        columnOrder = 'sale.date';
        break;
    }

    if (user.role === 'PROMOTOR') {
      const [data, count] = await getConnection()
        .createQueryBuilder(Sale, 'sale')
        .leftJoin('sale.client', 'client')
        .leftJoin('sale.user', 'user')
        .where('user.name ILIKE :name', {
          name: `%${keyword.toUpperCase()}%`,
        })
        .andWhere('user.id = :id', { id: user.id })
        .addSelect('client.id')
        .addSelect('client.name')
        .addSelect('client.surname')
        .addSelect('client.phones')
        .addSelect('client.address')
        .addSelect('user.id')
        .addSelect('user.name')
        .addSelect('user.email')
        .limit(take)
        .offset(skip)
        .orderBy(columnOrder, sort)
        .getManyAndCount();

      return { data, count };
    } else {
      const [data, count] = await getConnection()
        .createQueryBuilder(Sale, 'sale')
        .leftJoin('sale.client', 'client')
        .leftJoin('sale.user', 'user')
        .where('user.name ILIKE :name', {
          name: `%${keyword.toUpperCase()}%`,
        })
        .addSelect('client.id')
        .addSelect('client.name')
        .addSelect('client.surname')
        .addSelect('client.phones')
        .addSelect('client.address')
        .addSelect('user.id')
        .addSelect('user.name')
        .addSelect('user.email')
        .limit(take)
        .offset(skip)
        .orderBy(columnOrder, sort)
        .getManyAndCount();

      return { data, count };
    }
  }

  async findOne(id: number, user: { id: number; role: string }) {
    const sale = await this.saleRepository.findOne(id, {
      relations: [
        'saleDetails',
        'saleDetails.promotorProduct',
        'saleDetails.promotorProduct.product',
        'client',
        'user',
      ],
    });

    if (user.role === 'PROMOTOR' && user.id !== sale.user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: ['Este recurso no te pertenece'],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...sale,
      user: {
        id: sale.user.id,
        name: sale.user.name,
        email: sale.user.email,
      },
      saleDetails: sale.saleDetails.map((d) => ({
        ...d,
        product: {
          id: d.promotorProduct.product.id,
          name: d.promotorProduct.product.name,
          code: d.promotorProduct.product.code,
          description: d.promotorProduct.product.description,
          profit: d.promotorProduct.product.profit,
          price: d.promotorProduct.product.price,
          image: d.promotorProduct.product.image,
          createdAt: d.promotorProduct.product.createdAt,
          updatedAt: d.promotorProduct.product.updatedAt,
        },
        promotorProduct: undefined,
      })),
    };
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }

  async approve(id: number, user: { id: number; role: string }) {
    const sale = await this.saleRepository.findOne(id, {
      relations: [
        'saleDetails',
        'saleDetails.promotorProduct',
        'saleDetails.promotorProduct.product',
        'client',
        'user',
      ],
    });

    if (sale.status !== SaleStatus.PENDIENTE) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: ['La venta ya se encuentra en estado aprobado o anulado!'],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.role === 'PROMOTOR' && user.id !== sale.user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: ['Solo puedes aprobar tus propias ventas'],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const errors = this.findErrorOnSaleDetails(sale.saleDetails);

    if (errors.length) {
      this.throwErrors(errors);
    }

    const newPP: PromotorProduct[] = [];

    for (let i = 0; i < sale.saleDetails.length; i++) {
      const { promotorProduct, cant } = sale.saleDetails[i];
      promotorProduct.cant_out = promotorProduct.cant_out + cant;
      await this.promotorProductRespository.save(promotorProduct);
    }

    sale.status = SaleStatus.APROBADO;
    const saledb = await this.saleRepository.save(sale);

    return {
      ...saledb,
      user: {
        id: saledb.user.id,
        name: saledb.user.name,
        email: saledb.user.email,
      },
      saleDetails: saledb.saleDetails.map((d) => ({
        ...d,
        product: {
          id: d.promotorProduct.product.id,
          name: d.promotorProduct.product.name,
          code: d.promotorProduct.product.code,
          description: d.promotorProduct.product.description,
          image: d.promotorProduct.product.image,
          profit: d.promotorProduct.product.profit,
          price: d.promotorProduct.product.price,
          createdAt: d.promotorProduct.product.createdAt,
          updatedAt: d.promotorProduct.product.updatedAt,
        },
        promotorProduct: undefined,
      })),
    };
  }

  async cancelled(id: number, user: { id: number; role: string }) {
    const sale = await this.saleRepository.findOne(id, {
      relations: [
        'saleDetails',
        'saleDetails.promotorProduct',
        'saleDetails.promotorProduct.product',
        'client',
        'user',
      ],
    });

    if (user.role === 'PROMOTOR' && user.id !== sale.user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          messages: ['Este recurso no te pertenece'],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    sale.status = SaleStatus.ANULADO;
    const saledb = await this.saleRepository.save(sale);
    return {
      ...saledb,
      user: {
        id: saledb.user.id,
        name: saledb.user.name,
        email: saledb.user.email,
      },
      saleDetails: saledb.saleDetails.map((d) => ({
        ...d,
        product: {
          id: d.promotorProduct.product.id,
          name: d.promotorProduct.product.name,
          code: d.promotorProduct.product.code,
          description: d.promotorProduct.product.description,
          image: d.promotorProduct.product.image,
          profit: d.promotorProduct.product.profit,
          price: d.promotorProduct.product.price,
          createdAt: d.promotorProduct.product.createdAt,
          updatedAt: d.promotorProduct.product.updatedAt,
        },
        promotorProduct: undefined,
      })),
    };
  }

  public async getPendings(user: { role: string; id: number }) {
    const [sales, count] = await this.saleRepository.findAndCount({
      where:
        user.role !== 'PROMOTOR'
          ? { status: SaleStatus.PENDIENTE }
          : { user: { id: user.id }, status: SaleStatus.PENDIENTE },
    });
    return count;
  }

  private findErrorOnSaleDetails(details: SaleDetail[]) {
    const res: { availableCant: number; saleDetial: SaleDetail }[] = [];
    for (let i = 0; i < details.length; i++) {
      const { cant, promotorProduct } = details[i];
      if (promotorProduct.cant < promotorProduct.cant_out + cant) {
        res.push({
          availableCant: promotorProduct.cant - promotorProduct.cant_out,
          saleDetial: details[i],
        });
      }
    }
    return res;
  }

  private throwErrors(
    errors: { availableCant: number; saleDetial: SaleDetail }[],
  ) {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        messages: errors.map(
          (e) =>
            `El producto ${e.saleDetial.promotorProduct.product.name} tiene ${e.availableCant} unidades disponibles y es necesario  ${e.saleDetial.cant} unidades`,
        ),
        error: 'Bad request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
