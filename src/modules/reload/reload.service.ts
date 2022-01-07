import { Injectable } from '@nestjs/common';
import { CreateReloadDto } from './dto/create-reload.dto';
import { UpdateReloadDto } from './dto/update-reload.dto';

@Injectable()
export class ReloadService {
  create(createReloadDto: CreateReloadDto) {
    return 'This action adds a new reload';
  }

  findAll() {
    return `This action returns all reload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reload`;
  }

  update(id: number, updateReloadDto: UpdateReloadDto) {
    return `This action updates a #${id} reload`;
  }

  remove(id: number) {
    return `This action removes a #${id} reload`;
  }
}
