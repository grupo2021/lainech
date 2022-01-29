import { Injectable } from '@nestjs/common';
import { ImageInterface } from 'src/utils/image.interface';
import { Like } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FindAllDto } from '../findAll.dto';
import { UserRepository } from '../user/user.repository';
import { ClientRepository } from './clientsRepository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private clientRepository: ClientRepository,
    private userRepository: UserRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    user: any,
    file: ImageInterface,
  ) {
    const userdb = await this.userRepository.findOne(user.id);
    const client = this.clientRepository.create(createClientDto);
    client.user = userdb;

    if (file) {
      client.image = await this.cloudinaryService.uploadImage(file);
    }
    const clientdb = await this.clientRepository.save(client);
    return {
      ...clientdb,
      user: {
        id: clientdb.user.id,
        name: clientdb.user.name,
        email: clientdb.user.email,
      },
    };
  }

  async findAll(query: FindAllDto, user: any) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'ASC';

    if (user.role === 'PROMOTOR') {
      const userdb = await this.userRepository.findOne(user.id);

      const [data, count] = await this.clientRepository.findAndCount({
        where: {
          user: userdb,
          trade_name: Like('%' + keyword.toUpperCase() + '%'),
        },
        relations: ['user'],
        order: { trade_name: sort },
        take,
        skip,
      });
      return {
        data: data.map((d) => ({
          ...d,
          user: { id: d.user.id, name: d.user.name, email: d.user.email },
        })),
        count,
      };
    }

    const [data, count] = await this.clientRepository.findAndCount({
      where: { trade_name: Like('%' + keyword.toUpperCase() + '%') },
      relations: ['user'],
      order: { trade_name: sort },
      take,
      skip,
    });

    return {
      data: data.map((d) => ({
        ...d,
        user: { id: d.user.id, name: d.user.name, email: d.user.email },
      })),
      count,
    };
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOne(id, {
      relations: ['user'],
    });
    return {
      ...client,
      user: {
        id: client.user.id,
        name: client.user.name,
        email: client.user.email,
      },
    };
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
    file: ImageInterface,
  ) {
    const client = await this.clientRepository.findOne(id, {
      relations: ['user'],
    });
    this.clientRepository.merge(client, updateClientDto);

    if (file) {
      if (client.image === 'www.noimage.com') {
        client.image = await this.cloudinaryService.uploadImage(file);
      } else {
        client.image = await this.cloudinaryService.replaceImage(
          client.image,
          file,
        );
      }
    }

    const clientdb = await this.clientRepository.save(client);

    return {
      ...clientdb,
      user: {
        id: clientdb.user.id,
        name: clientdb.user.name,
        email: clientdb.user.email,
      },
    };
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOne(id, {
      relations: ['user'],
    });
    await this.clientRepository.delete(id);
    return {
      ...client,
      user: {
        id: client.user.id,
        name: client.user.name,
        email: client.user.email,
      },
    };
  }

  async findAllWithoutPagination(userId: number) {
    const user = await this.userRepository.findOne(userId);
    const clients = await this.clientRepository.find({
      where: { user: user },
      relations: ['user'],
    });
    return clients.map((c) => ({
      ...c,
      user: { id: c.user.id, name: c.user.name, email: c.user.email },
    }));
  }
}
