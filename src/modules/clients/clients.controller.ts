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
@Roles(RoleOptions.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.clientsService.findAll(query);
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
