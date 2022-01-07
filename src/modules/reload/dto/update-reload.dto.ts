import { PartialType } from '@nestjs/mapped-types';
import { CreateReloadDto } from './create-reload.dto';

export class UpdateReloadDto extends PartialType(CreateReloadDto) {}
