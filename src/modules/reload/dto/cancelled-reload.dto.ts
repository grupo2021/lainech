import { IsNotEmpty } from 'class-validator';

export class CancelledReloadDto {
  @IsNotEmpty()
  return_description: string;
}
