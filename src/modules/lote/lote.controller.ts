import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { LoteService } from './lote.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { RolesGuard } from '../auth/authorization/role.guard';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindOneLoteDto } from './dto/find-one-lote.dto';

@Controller('lote')
@Roles(RoleOptions.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.loteService.create(createLoteDto);
  }

  @Get()
  findAll() {
    return this.loteService.findAll();
  }

  @Get(':id')
  findOne(@Param() findOneDto: FindOneLoteDto) {
    return this.loteService.findOne(findOneDto.id);
  }

  @Put(':id')
  update(
    @Param() findOneDto: FindOneLoteDto,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.loteService.update(findOneDto.id, updateLoteDto);
  }

  @Delete(':id')
  remove(@Param() findOneDto: FindOneLoteDto) {
    return this.loteService.remove(findOneDto.id);
  }
}
