import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { RolesGuard } from '../auth/authorization/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindAllDto } from '../findAll.dto';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { FindOneClientDto } from './dto/find-one-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
@Roles(RoleOptions.Admin, RoleOptions.Promotor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(RoleOptions.Admin, RoleOptions.Promotor)
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    return this.clientsService.create(createClientDto, req.user);
  }

  @Get()
  findAll(@Query() query: FindAllDto, @Request() req) {
    return this.clientsService.findAll(query, req.user);
  }

  @Get(':id')
  findOne(@Param() findOneDto: FindOneClientDto) {
    return this.clientsService.findOne(findOneDto.id);
  }

  @Put(':id')
  update(
    @Param() findOneDto: FindOneClientDto,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(findOneDto.id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param() findOneDto: FindOneClientDto) {
    return this.clientsService.remove(findOneDto.id);
  }
}
