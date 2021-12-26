import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';

export enum RoleCode {
  ADMIN = 'ADMIN',
  ALMACENERO = 'ALMACENERO',
  PROMOTOR = 'PROMOTOR',
}

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  create(createRoleDto: CreateRoleDto) {
    const newRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne(id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne(id);
    this.roleRepository.merge(role, updateRoleDto);
    try {
      return await this.roleRepository.save(role);
    } catch (error) {
      return null;
    }
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne(id);
    await this.roleRepository.delete(id);
    return role;
  }

  findByCode(code: string) {
    return this.roleRepository.findOne({ where: { code } });
  }
}
