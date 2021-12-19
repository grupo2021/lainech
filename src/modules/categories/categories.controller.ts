import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { RolesGuard } from '../auth/authorization/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindAllDto } from '../findAll.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindOneCategoryDto } from './dto/find-one-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@Roles(RoleOptions.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.categoriesService.findAll(query);
  }

  @Get('no-pagination')
  findAllWithoutPagination() {
    return this.categoriesService.findAllWithOutPagination();
  }

  @Get(':id')
  findOne(@Param() findOneDto: FindOneCategoryDto) {
    return this.categoriesService.findOne(findOneDto.id);
  }

  @Put(':id')
  update(
    @Param() findOneDto: FindOneCategoryDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(findOneDto.id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param() findOneDto: FindOneCategoryDto) {
    return this.categoriesService.remove(findOneDto.id);
  }
}
