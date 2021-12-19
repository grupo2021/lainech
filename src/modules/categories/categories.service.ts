import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { FindAllDto } from '../findAll.dto';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoriesRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  async findAll(query: FindAllDto) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'ASC';

    const [data, count] = await this.categoryRepository.findAndCount({
      where: { code: Like('%' + keyword.toUpperCase() + '%') },
      order: { code: sort },
      take,
      skip,
    });

    return { data, count };
  }

  findAllWithOutPagination() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne(id);

    const { code } = updateCategoryDto;

    if (code.toUpperCase().trim() != category.code.toUpperCase().trim()) {
      const oldCategory = await this.categoryRepository.findOneByCode(
        code.trim().toUpperCase(),
      );
      if (oldCategory) {
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

    this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne(id);
    await this.categoryRepository.delete(id);

    return category;
  }
}
