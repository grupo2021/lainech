import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/authorization/role.guard';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { FindAllDto } from '../findAll.dto';
import { FindOneSaleDto } from './dto/find-one-sale.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(RoleOptions.Promotor, RoleOptions.Admin)
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    return this.salesService.create(createSaleDto, req.user.id);
  }

  @Get()
  @Roles(RoleOptions.Promotor, RoleOptions.Admin)
  findAll(@Query() query: FindAllDto, @Request() req) {
    return this.salesService.findAll(req.user, query);
  }

  @Get('pending-count')
  @Roles(RoleOptions.Promotor, RoleOptions.Admin)
  getPendings(@Request() req) {
    return this.salesService.getPendings(req.user);
  }

  @Post('approve/:id')
  approve(@Param() param: FindOneSaleDto, @Request() req) {
    return this.salesService.approve(param.id, req.user);
  }

  @Post('cancelled/:id')
  cancelled(@Param() param: FindOneSaleDto, @Request() req) {
    return this.salesService.cancelled(param.id, req.user);
  }

  @Get(':id')
  @Roles(RoleOptions.Promotor, RoleOptions.Admin)
  findOne(@Param() param: FindOneSaleDto, @Request() req) {
    return this.salesService.findOne(param.id, req.user);
  }
}
