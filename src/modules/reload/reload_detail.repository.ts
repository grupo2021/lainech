import { EntityRepository, Repository } from 'typeorm';
import { ReloadDetail } from './entities/reload_detail.entity';

@EntityRepository(ReloadDetail)
export class ReloadDetailRepository extends Repository<ReloadDetail> {}
