import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { UserRepository } from '../user/user.repository';
import { CreateReloadDto } from './dto/create-reload.dto';
import { UpdateReloadDto } from './dto/update-reload.dto';
import { ReloadDetail } from './entities/reload_detail.entity';
import { ReloadRepository } from './reload.repository';
import { ReloadDetailRepository } from './reload_detail.repository';

@Injectable()
export class ReloadService {
  constructor(
    private userRepository: UserRepository,
    private reloadRepository: ReloadRepository,
    private reloadDetailRepository: ReloadDetailRepository,
    private productRepository: ProductsRepository,
  ) {}

  async create(createReloadDto: CreateReloadDto, userId: number) {
    const { details: det } = createReloadDto;

    const details = JSON.parse(det) || [];
    const detailsArr = details as {
      productId: number;
      cant: number;
      subtotal: number;
    }[];

    const reload = this.reloadRepository.create(createReloadDto);

    const user = await this.userRepository.findOne(userId);
    const reloadDetails: ReloadDetail[] = [];
    for (let i = 0; i < detailsArr.length; i++) {
      const { cant, subtotal, productId } = detailsArr[i];
      const product = await this.productRepository.findOne(productId);
      const reloadDetail = this.reloadDetailRepository.create({
        cant,
        subtotal,
        product,
      });
      reloadDetails.push(reloadDetail);
    }

    reload.user = user;
    reload.reloadDetails = reloadDetails;

    return this.reloadRepository.save(reload);
  }

  async findAll() {
    const reloads = await this.reloadRepository.find({ relations: ['user'] });

    return reloads.map((r) => ({
      ...r,
      user: { id: r.user.id, name: r.user.name, email: r.user.email },
    }));
  }

  async findOne(id: number) {
    const reload = await this.reloadRepository.findOne(id, {
      relations: ['user', 'reloadDetails', 'reloadDetails.product'],
    });

    return {
      ...reload,
      user: {
        id: reload.user.id,
        name: reload.user.name,
        email: reload.user.email,
      },
    };
  }

  async update(id: number, updateReloadDto: UpdateReloadDto) {
    const reload = await this.reloadRepository.findOne(id, {
      relations: ['user'],
    });
    reload.status = updateReloadDto.status;
    const newReload = await this.reloadRepository.save(reload);
    return {
      ...newReload,
      user: {
        id: newReload.user.id,
        name: newReload.user.name,
        email: newReload.user.email,
      },
    };
  }

  remove(id: number) {
    return `This action is not implemented`;
  }
}
