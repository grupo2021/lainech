import { IsNotEmpty, IsOptional } from 'class-validator';
import { UniqueCode } from 'src/validations/unique-code';
import { Role } from '../entities/role.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsOptional()
  description: string;
}
