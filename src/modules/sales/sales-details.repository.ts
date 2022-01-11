import { EntityRepository, Repository } from 'typeorm';
import { SaleDetail } from './entities/sale-details.entity';

@EntityRepository(SaleDetail)
export class SalesDetailsRepository extends Repository<SaleDetail> {}
