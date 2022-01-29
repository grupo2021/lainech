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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { ImageInterface } from 'src/utils/image.interface';
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
    @Body() createClientDto: CreateClientDto,
    @Request() req,
    @UploadedFile() file: ImageInterface,
  ) {
    return this.clientsService.create(createClientDto, req.user, file);
  }

  @Get()
  findAll(@Query() query: FindAllDto, @Request() req) {
    return this.clientsService.findAll(query, req.user);
  }

  @Get('all')
  findAllWithouPagination(@Request() req) {
    return this.clientsService.findAllWithoutPagination(req.user.id);
  }

  @Get(':id')
  findOne(@Param() findOneDto: FindOneClientDto) {
    return this.clientsService.findOne(findOneDto.id);
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
    @Param() findOneDto: FindOneClientDto,
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFile() file: ImageInterface,
  ) {
    return this.clientsService.update(findOneDto.id, updateClientDto, file);
  }

  @Delete(':id')
  remove(@Param() findOneDto: FindOneClientDto) {
    return this.clientsService.remove(findOneDto.id);
  }
}
