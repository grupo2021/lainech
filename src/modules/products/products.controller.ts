import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { ImageInterface } from 'src/utils/image.interface';
import { RoleOptions, Roles } from '../auth/authorization/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/authorization/role.guard';
import { FindAllDto } from '../findAll.dto';
import { FindOneProductDto } from './dto/find-one-product.dto';

@Controller('products')
@Roles(RoleOptions.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '../../public/img/uploads'),
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: ImageInterface,
    @Request() req,
  ) {
    return this.productsService.create(createProductDto, file, req.user.id);
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() findOneDto: FindOneProductDto) {
    return this.productsService.findOne(findOneDto.id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '../../public/img/uploads'),
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  update(
    @Param() findOneDto: FindOneProductDto,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: ImageInterface,
  ) {
    return this.productsService.update(findOneDto.id, updateProductDto, file);
  }

  @Delete(':id')
  remove(@Param() findOneDto: FindOneProductDto) {
    return this.productsService.remove(findOneDto.id);
  }
}
