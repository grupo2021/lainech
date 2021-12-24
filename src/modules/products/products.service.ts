import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ImageInterface } from 'src/utils/image.interface';
import { Like } from 'typeorm';
import { CategoriesRepository } from '../categories/categories.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FindAllDto } from '../findAll.dto';
import { UserRepository } from '../user/user.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private productRepository: ProductsRepository,
    private userRepository: UserRepository,
    private categoryRepository: CategoriesRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    file: ImageInterface,
    userId: number,
  ) {
    if (!file) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: [`image should not be empty`],
          error: 'Bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { categoryId } = createProductDto;
    const user = await this.userRepository.findOne(userId);
    const category = await this.categoryRepository.findOne(categoryId);
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.user = user;
    product.image = await this.cloudinaryService.uploadImage(file);

    const newProduct = await this.productRepository.save(product);
    const { user: u, ...res } = newProduct;
    return res;
  }

  async findAll(query: FindAllDto) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'ASC';

    const [data, count] = await this.productRepository.findAndCount({
      relations: ['category'],
      where: { name: Like('%' + keyword.toUpperCase() + '%') },
      order: { name: sort },
      take,
      skip,
    });

    return { data, count };
  }

  findOne(id: number) {
    return this.productRepository.findOne(id, {
      relations: ['category', 'lotes'],
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file: ImageInterface,
  ) {
    const { code, categoryId } = updateProductDto;
    const product = await this.productRepository.findOne(id);
    const category = await this.categoryRepository.findOne(categoryId);

    if (product.code.toUpperCase() != code.trim().toUpperCase()) {
      const oldProduct = await this.productRepository.findOneByCode(
        code.trim().toUpperCase(),
      );
      if (oldProduct) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: [
              `The field code: ${code} already exists. Choose another!`,
            ],
            error: 'Bad request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    this.productRepository.merge(product, updateProductDto);

    if (file) {
      product.image = await this.cloudinaryService.replaceImage(
        product.image,
        file,
      );
    }
    product.category = category;

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne(id, {
      relations: ['category'],
    });
    await this.cloudinaryService.deleteImage(product.image);
    await this.productRepository.delete(id);
    return product;
  }
}
