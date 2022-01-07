import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReloadService } from './reload.service';
import { CreateReloadDto } from './dto/create-reload.dto';
import { UpdateReloadDto } from './dto/update-reload.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/authorization/role.guard';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { FindOneReloadDto } from './dto/find-one-reload.dto';

@Controller('reload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReloadController {
  constructor(private readonly reloadService: ReloadService) {}

  @Post()
  @Roles(RoleOptions.Promotor)
  create(@Body() createReloadDto: CreateReloadDto, @Request() req) {
    return this.reloadService.create(createReloadDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.reloadService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: FindOneReloadDto) {
    return this.reloadService.findOne(params.id);
  }

  @Put(':id')
  @Roles(RoleOptions.Admin, RoleOptions.Almacenero)
  update(
    @Param() params: FindOneReloadDto,
    @Body() updateReloadDto: UpdateReloadDto,
  ) {
    return this.reloadService.update(params.id, updateReloadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reloadService.remove(+id);
  }
}
