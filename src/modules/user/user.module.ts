import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { UserRepository } from './user.repository';
import { ProfileRepository } from '../profile/profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ProfileRepository]),
    RoleModule,
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
