import { ExistsOnDatabase } from '../../../validations/exists-on-database';
import { Role } from '../entities/role.entity';

export class FindOneRoleDto {
  @ExistsOnDatabase(Role)
  id: number;
}
