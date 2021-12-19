import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Client } from '../entities/client.entity';

export class FindOneClientDto {
  @ExistsOnDatabase(Client)
  id: number;
}
