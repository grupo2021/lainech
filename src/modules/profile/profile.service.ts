import { Injectable } from '@nestjs/common';
import { ImageInterface } from 'src/utils/image.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserRepository } from '../user/user.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private profileRepository: ProfileRepository,
    private userRepository: UserRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async update(updateProfileDto: UpdateProfileDto, file: ImageInterface) {
    const { userId, phones, name, surname } = updateProfileDto;
    const user = await this.userRepository.findOne(userId, {
      relations: ['role', 'profile'],
    });
    const newProfile = this.profileRepository.create(updateProfileDto);
    if (phones) {
      newProfile.phones = JSON.stringify(JSON.parse(phones));
    }
    if (file) {
      if (user.profile.photo) {
        newProfile.photo = await this.cloudinaryService.replaceImage(
          user.profile.photo,
          file,
        );
      } else {
        newProfile.photo = await this.cloudinaryService.uploadImage(file);
      }
    }
    user.profile = newProfile;
    const newName = this.generateUserName(name, surname);
    if (newName) {
      user.name = newName;
    }
    const newUser = await this.userRepository.save(user);
    const { password, ...rest } = newUser;
    return { ...rest, role: rest.role.code };
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

  private generateUserName(name: string, surname: string): string | null {
    let res = null;
    if (name) res = name;
    if (surname) res = `${res} ${surname}`;
    return res;
  }
}
