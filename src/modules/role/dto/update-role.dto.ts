import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UniqueCode } from 'src/validations/unique-code';
import { Role } from '../entities/role.entity';

export class UpdateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsOptional()
  description: string;
}
