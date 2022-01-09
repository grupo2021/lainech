import { EntityRepository, Repository } from 'typeorm';
import { PromotorProduct } from './entities/promotor-product.entity';

@EntityRepository(PromotorProduct)
export class PromotorProductRepository extends Repository<PromotorProduct> {}
