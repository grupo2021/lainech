import { IsNotEmpty } from 'class-validator';
import { ExistsOnDatabase } from 'src/validations/exists-on-database';
import { Reload } from '../entities/reload.entity';

export class FindOneReloadDto {
  @IsNotEmpty()
  @ExistsOnDatabase(Reload)
  id: number;
}
