import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
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
  ) {}

  async create(createClientDto: CreateClientDto, user: any) {
    const userdb = await this.userRepository.findOne(user.id);
    const client = this.clientRepository.create(createClientDto);
    client.user = userdb;
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
      console.log('entro');
      const userdb = await this.userRepository.findOne(user.id);

      const [data, count] = await this.clientRepository.findAndCount({
        where: { user: userdb, name: Like('%' + keyword.toUpperCase() + '%') },
        relations: ['user'],
        order: { name: sort },
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
      where: { name: Like('%' + keyword.toUpperCase() + '%') },
      relations: ['user'],
      order: { name: sort },
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

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOne(id, {
      relations: ['user'],
    });
    this.clientRepository.merge(client, updateClientDto);

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
}
