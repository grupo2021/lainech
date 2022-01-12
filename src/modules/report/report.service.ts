import { Injectable } from '@nestjs/common';
import { Between, getConnection } from 'typeorm';

import { Sale } from '../sales/entities/sale.entity';
import { User } from '../user/entities/user.entity';

import { UserRepository } from '../user/user.repository';
import { ReloadRepository } from '../reload/reload.repository';

import { GenerateReportDto, ReportType } from './dto/generate-report.dto';

@Injectable()
export class ReportService {
  constructor(
    private userRepository: UserRepository,
    private reloadRepository: ReloadRepository,
  ) {}

  async generateReport(reportDto: GenerateReportDto) {
    const { userId, initDate, endDate, type } = reportDto;

    const user = await this.userRepository.findOne(userId);

    if (type === ReportType.VENTAS) {
      return this.generateSalesReport(user, initDate, endDate, userId);
    } else {
      return this.generateReloadReport(user, initDate, endDate);
    }
  }

  private async generateSalesReport(
    user: User,
    initDate: Date,
    endDate: Date,
    userId: number,
  ) {
    const [data, count] = await getConnection()
      .createQueryBuilder(Sale, 'sale')
      .leftJoinAndSelect('sale.client', 'client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('sale.saleDetails', 'saleDetails')
      .leftJoinAndSelect('saleDetails.promotorProduct', 'promotorProduct')
      .leftJoinAndSelect('promotorProduct.product', 'product')
      .where('user.id = :id', { id: userId })
      .andWhere(`sale.date BETWEEN '${initDate}' AND '${endDate}'`)
      .andWhere(`sale.status = 'APROBADO'`)
      .getManyAndCount();

    const report = data.map((d) => ({
      ...d,
      client: undefined,
      details: d.saleDetails.map((d) => ({
        ...d,
        product: d.promotorProduct.product,
        promotorProduct: undefined,
      })),
      saleDetails: undefined,
    }));

    const res = { id: user.id, name: user.name, email: user.email, report };

    return { data: res, count };
  }

  private async generateReloadReport(
    user: User,
    initDate: Date,
    endDate: Date,
  ) {
    const [reloads, count] = await this.reloadRepository.findAndCount({
      where: {
        user: user,
        date: Between(initDate, endDate),
        status: 'APROBADO',
      },
      relations: ['user', 'reloadDetails', 'reloadDetails.product'],
    });

    const report = reloads.map((r) => ({
      ...r,
      user: undefined,
      reloadDetails: undefined,
      details: r.reloadDetails,
    }));

    const res = {
      id: user.id,
      name: user.name,
      email: user.email,
      report,
    };

    return { data: res, count };
  }
}
