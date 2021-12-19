import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../user/user.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileRepository, UserRepository]),
    CloudinaryModule,
  ],
  exports: [ProfileService],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
