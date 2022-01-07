import { EntityRepository, Repository } from 'typeorm';
import { Reload } from './entities/reload.entity';

@EntityRepository(Reload)
export class ReloadRepository extends Repository<Reload> {}
