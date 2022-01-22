import { Injectable } from '@nestjs/common';
import { Between, getConnection } from 'typeorm';

import { ReloadRepository } from '../reload/reload.repository';

import {
  GenerateReportDto,
  ReportStatus,
  ReportType,
} from './dto/generate-report.dto';
import { SalesRepository } from '../sales/sales.repository';
import { Client } from '../clients/entities/client.entity';
import { ReturnsRepository } from '../returns/returns.repository';

@Injectable()
export class ReportService {
  constructor(
    private reloadRepository: ReloadRepository,
    private saleRepository: SalesRepository,
    private returnsRepository: ReturnsRepository,
  ) {}

  async generateReport(reportDto: GenerateReportDto) {
    const { userId, initDate, endDate, type, status } = reportDto;

    switch (type) {
      case ReportType.VENTAS:
        return this.generateSalesReport(initDate, endDate, userId, status);
      case ReportType.RECARGAS:
        return this.generateReloadReport(userId, initDate, endDate, status);
      case ReportType.BEST:
        return this.generateBestSale(userId, initDate, endDate);
      case ReportType.RETURNS:
        return this.generateReturnsReport(userId, initDate, endDate, status);
    }
  }

  private async generateSalesReport(
    initDate: Date,
    endDate: Date,
    userId: number,
    status: ReportStatus,
  ) {
    const [data, count] = await this.saleRepository.findAndCount({
      where:
        status !== 'ALL'
          ? {
              date: Between(initDate, endDate),
              user: userId == 0 ? {} : { id: userId },
              status,
            }
          : {
              date: Between(initDate, endDate),
              user: userId == 0 ? {} : { id: userId },
            },
      relations: [
        'user',
        'client',
        'saleDetails',
        'saleDetails.promotorProduct',
        'saleDetails.promotorProduct.product',
        'saleDetails.promotorProduct.product.category',
      ],
    });

    return {
      data: data.map((d) => ({
        ...d,
        user: { id: d.user.id, name: d.user.name, email: d.user.email },
        details: d.saleDetails.map((s) => ({
          ...s,
          product: s.promotorProduct.product,
          promotorProduct: undefined,
        })),
        saleDetails: undefined,
      })),
      count,
      type: 'SALES',
    };
  }

  private async generateReloadReport(
    userId: number,
    initDate: Date,
    endDate: Date,
    status: ReportStatus,
  ) {
    const [reloads, count] = await this.reloadRepository.findAndCount({
      where:
        status == 'ALL'
          ? {
              user: userId == 0 ? {} : { id: userId },
              date: Between(initDate, endDate),
            }
          : {
              user: userId == 0 ? {} : { id: userId },
              date: Between(initDate, endDate),
              status,
            },
      relations: [
        'user',
        'almacenero',
        'reloadDetails',
        'reloadDetails.product',
      ],
    });

    return {
      data: reloads.map((r) => ({
        ...r,
        user: { id: r.user.id, name: r.user.name, email: r.user.email },
        almacenero: r.almacenero
          ? {
              id: r.almacenero.id,
              name: r.almacenero.name,
              email: r.almacenero.email,
            }
          : null,
        details: r.reloadDetails,
        reloadDetails: undefined,
      })),
      count,
      type: 'RELOADS',
    };
  }

  private async generateBestSale(
    promotorId: number,
    initDate: Date,
    endDate: Date,
  ) {
    const [data, count] = await getConnection()
      .createQueryBuilder(Client, 'client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('client.sales', 'sale')
      .leftJoinAndSelect('sale.saleDetails', 'saleDetails')
      .leftJoinAndSelect('saleDetails.promotorProduct', 'promotorProduct')
      .leftJoinAndSelect('promotorProduct.product', 'product')
      .where(promotorId == 0 ? '' : `user.id = ${promotorId}`)
      .andWhere(`sale.date BETWEEN '${initDate}' AND '${endDate}'`)
      .getManyAndCount();

    const res = data
      .map((d) => ({
        id: d.id,
        name: d.trade_name,
        user: { id: d.user.id, name: d.user.name, email: d.user.email },
        total: d.sales.reduce((counter, item) => counter + item.total, 0),
        cant: d.sales.reduce(
          (counter, item) =>
            counter + item.saleDetails.reduce((c, i) => c + i.cant, 0),
          0,
        ),
        best_product: d.sales
          .map((s) =>
            s.saleDetails.map((sd) => ({
              id: sd.promotorProduct.product.id,
              product: sd.promotorProduct.product.name,
              code: sd.promotorProduct.product.code,
              subtotal: sd.subtotal,
              cant: sd.cant,
            })),
          )
          .flat()
          .reduce((acum, item) => {
            const current = acum.find((a) => a.id === item.id);
            if (current) {
              current.subtotal += item.subtotal;
              current.cant += item.cant;
            } else {
              acum.push(item);
            }
            return acum;
          }, [])
          .reduce(
            (res, item) =>
              item.subtotal > (res['subtotal'] || 0) ? item : res,
            {},
          ),
      }))
      .sort((a, b) => b.total - a.total);

    return { data: res, count, type: 'BEST_SALE' };
  }

  private async generateReturnsReport(
    userId: number,
    initDate: Date,
    endDate: Date,
    status: ReportStatus,
  ) {
    const [data, count] = await this.returnsRepository.findAndCount({
      where:
        status == 'ALL'
          ? {
              promotorProduct: userId == 0 ? {} : { user: { id: userId } },
              date: Between(initDate, endDate),
            }
          : {
              promotorProduct: userId == 0 ? {} : { user: { id: userId } },
              date: Between(initDate, endDate),
              status,
            },
      relations: [
        'promotorProduct',
        'promotorProduct.user',
        'promotorProduct.product',
        'almacenero',
      ],
    });

    return {
      data: data.map((d) => ({
        ...d,
        almacenero: d.almacenero
          ? {
              id: d.almacenero.id,
              name: d.almacenero.name,
              email: d.almacenero.email,
            }
          : null,
        promotorProduct: {
          ...d.promotorProduct,
          user: {
            id: d.promotorProduct.user.id,
            name: d.promotorProduct.user.name,
            email: d.promotorProduct.user.email,
          },
        },
      })),
      count,
      type: 'RETURNS',
    };
  }
}
