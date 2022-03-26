import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Put,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/authorization/role.guard';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { FindAllDto } from '../findAll.dto';
import { FindOneReturnDto } from './dto/find-one-return.dto';

@Controller('returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @Roles(RoleOptions.Promotor)
  create(@Body() createReturnDto: CreateReturnDto, @Request() req) {
    return this.returnsService.create(createReturnDto, req.user);
  }

  @Get()
  findAll(@Request() req, @Query() query: FindAllDto) {
    return this.returnsService.findAll(req.user, query);
  }

  @Get('pending-count')
  getPendings(@Request() req) {
    return this.returnsService.getPendings(req.user);
  }

  @Get(':id')
  findOne(@Param() params: FindOneReturnDto, @Request() req) {
    return this.returnsService.findOne(params.id, req.user);
  }

  @Put(':id')
  @Roles(RoleOptions.Admin, RoleOptions.Almacenero)
  update(
    @Param() params: FindOneReturnDto,
    @Body() updateReturnDto: UpdateReturnDto,
    @Request() req,
  ) {
    return this.returnsService.update(params.id, updateReturnDto, req.user.id);
  }
}
