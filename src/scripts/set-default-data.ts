import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { ConfigOptions } from 'src/config/config';
import { Role } from '../modules/role/entities/role.entity';
import { User } from '../modules/user/entities/user.entity';
import { PasswordEncrypter } from '../utils/password-encrypter';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { RoleCode } from 'src/modules/role/role.service';

const setDefaultData = async (configService: ConfigService) => {
  const roleRepository = getRepository<Role>(Role);
  const userRepository = getRepository<User>(User);
  const profileRepository = getRepository<Profile>(Profile);

  let roleAdmin = await roleRepository
    .createQueryBuilder()
    .where('code = :code', {
      code: RoleCode.ADMIN,
    })
    .getOne();

  if (!roleAdmin) {
    const newAdminRole = roleRepository.create({
      name: 'Administrador',
      code: RoleCode.ADMIN,
      description: 'Puede hacer todo',
    });
    roleAdmin = await roleRepository.save(newAdminRole);
  }

  let promotorRole = await roleRepository
    .createQueryBuilder()
    .where('code = :code', {
      code: RoleCode.PROMOTOR,
    })
    .getOne();

  if (!promotorRole) {
    const newPromotorRole = roleRepository.create({
      name: 'Promotor',
      code: RoleCode.PROMOTOR,
      description: 'Realiza ventas hacia los clietes',
    });
    promotorRole = await roleRepository.save(newPromotorRole);
  }

  const almaceneroRole = await roleRepository
    .createQueryBuilder()
    .where('code = :code', {
      code: RoleCode.ALMACENERO,
    })
    .getOne();

  if (!almaceneroRole) {
    const newalmaceneroRole = roleRepository.create({
      name: 'Usuario',
      code: RoleCode.ALMACENERO,
      description: 'Maneja inventarios',
    });
    await roleRepository.save(newalmaceneroRole);
  }

  const user = await userRepository
    .createQueryBuilder()
    .where('email = :email', {
      email: configService.get(ConfigOptions.defaultUserEmail),
    })
    .getOne();

  if (!user) {
    const profile = profileRepository.create();
    profile.name = ConfigOptions.defaultUserName;
    const newuser = userRepository.create({
      name: configService.get(ConfigOptions.defaultUserName),
      email: configService.get(ConfigOptions.defaultUserEmail),
      password: PasswordEncrypter.encrypt(
        configService.get(ConfigOptions.defaultUserPassword),
      ),
      role: roleAdmin,
      profile,
    });
    await userRepository.save(newuser);
  }
};

export default setDefaultData;
