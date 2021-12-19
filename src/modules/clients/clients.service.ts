import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { FindAllDto } from '../findAll.dto';
import { ClientRepository } from './clientsRepository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private clientRepository: ClientRepository) {}

  create(createClientDto: CreateClientDto) {
    return this.clientRepository.save(createClientDto);
  }

  async findAll(query: FindAllDto) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'ASC';

    const [data, count] = await this.clientRepository.findAndCount({
      where: { name: Like('%' + keyword.toUpperCase() + '%') },
      order: { name: sort },
      take,
      skip,
    });

    return { data, count };
  }

  findOne(id: number) {
    return this.clientRepository.findOne(id);
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOne(id);
    this.clientRepository.merge(client, updateClientDto);

    return this.clientRepository.save(client);
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOne(id);
    await this.clientRepository.delete(id);
    return client;
  }
}
