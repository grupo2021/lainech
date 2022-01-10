import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { RolesGuard } from '../auth/authorization/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindAllDto } from '../findAll.dto';
import { FindOnePPDto } from './dto/find-one-pp.dto';
import { PromotorProductService } from './promotor-product.service';

@Controller('promotor-product')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleOptions.Promotor)
export class PromotorProductController {
  constructor(
    private readonly promotorProductService: PromotorProductService,
  ) {}

  @Get()
  findAll(@Query() query: FindAllDto, @Request() req) {
    return this.promotorProductService.findAllByUserWithPagination(
      query,
      req.user.id,
    );
  }

  @Get(':id')
  findOne(@Param() params: FindOnePPDto, @Request() req) {
    return this.promotorProductService.findOne(params.id, req.user.id);
  }
}
