import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Lote } from './entities/lote.entity';

@EntityRepository(Lote)
export class LoteRepository extends Repository<Lote> {}
