import { EntityRepository, Repository } from 'typeorm';
import { Return } from './entities/return.entity';

@EntityRepository(Return)
export class ReturnsRepository extends Repository<Return> {}
