import { Injectable } from '@nestjs/common';
import { PasswordEncrypter } from 'src/utils/password-encrypter';
import { Like } from 'typeorm';
import { FindAllDto } from '../findAll.dto';
import { ProfileRepository } from '../profile/profile.repository';
import { RoleCode, RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RenewUserDto } from './dto/renew-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private profileRepository: ProfileRepository,
    private roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const profile = this.profileRepository.create({ name: createUserDto.name });
    if (createUserDto.roleId) {
      newUser.role = await this.roleService.findOne(createUserDto.roleId);
    } else {
      newUser.role = await this.roleService.findByCode(RoleCode.PROMOTOR);
    }
    newUser.password = PasswordEncrypter.encrypt(createUserDto.password);
    newUser.profile = profile;

    const { password, ...data } = await this.userRepository.save(newUser);
    return data;
  }

  async findAll(query: FindAllDto) {
    const page = query.page || 0;
    const keyword = query.keyword || '';
    const take = query.take || 10;
    const skip = page * take;
    const sort = query.sort || 'ASC';

    const [data, count] = await this.userRepository.findAndCount({
      select: ['email', 'id', 'name', 'status', 'createdAt', 'updatedAt'],
      relations: ['role', 'profile'],
      where: { name: Like('%' + keyword.toUpperCase() + '%') },
      order: { name: sort },
      take,
      skip,
    });

    return { data: data.map((u) => ({ ...u, role: u.role.code })), count };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
      relations: ['role', 'profile'],
    });

    return { ...user, role: user.role.code };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    this.userRepository.merge(user, updateUserDto);
    user.role = await this.roleService.findOne(updateUserDto.roleId);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      return null;
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id, {
      select: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
      relations: ['role', 'profile'],
    });
    user.status = UserStatus.DELETE;
    const res = await this.userRepository.save(user);
    return { ...res, role: res.role.code };
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email, status: UserStatus.ACTIVE },
      relations: ['role', 'profile'],
    });
  }

  async changeStatus(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
      relations: ['role', 'profile'],
    });
    user.status =
      user.status === UserStatus.ACTIVE ? UserStatus.DELETE : UserStatus.ACTIVE;
    const res = await this.userRepository.save(user);
    return { ...res, role: res.role.code };
  }

  async findALLPromotors() {
    const role = await this.roleService.findByCode('PROMOTOR');
    const users = await this.userRepository.find({ where: { role } });
    return users.map((u) => ({ id: u.id, name: u.name, email: u.email }));
  }

  async changePassword(renew: RenewUserDto) {
    const { password, userId } = renew;
    const user = await this.userRepository.findOne(userId, {
      relations: ['role', 'profile'],
    });
    user.password = PasswordEncrypter.encrypt(password);
    const { password: pass, ...rest } = await this.userRepository.save(user);
    return { ...rest, role: rest.role.code };
  }
}
