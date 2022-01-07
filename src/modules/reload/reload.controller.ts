import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReloadService } from './reload.service';
import { CreateReloadDto } from './dto/create-reload.dto';
import { UpdateReloadDto } from './dto/update-reload.dto';

@Controller('reload')
export class ReloadController {
  constructor(private readonly reloadService: ReloadService) {}

  @Post()
  create(@Body() createReloadDto: CreateReloadDto) {
    return this.reloadService.create(createReloadDto);
  }

  @Get()
  findAll() {
    return this.reloadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reloadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReloadDto: UpdateReloadDto) {
    return this.reloadService.update(+id, updateReloadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reloadService.remove(+id);
  }
}
