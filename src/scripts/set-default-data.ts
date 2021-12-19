import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { ConfigOptions } from 'src/config/config';
import { Role } from '../modules/role/entities/role.entity';
import { User } from '../modules/user/entities/user.entity';
import { PasswordEncrypter } from '../utils/password-encrypter';
import { Profile } from 'src/modules/profile/entities/profile.entity';

const setDefaultData = async (configService: ConfigService) => {
  const roleRepository = getRepository<Role>(Role);
  const userRepository = getRepository<User>(User);
  const profileRepository = getRepository<Profile>(Profile);

  let roleAdmin = await roleRepository
    .createQueryBuilder()
    .where('code = :code', {
      code: 'ADMIN',
    })
    .getOne();

  if (!roleAdmin) {
    const newAdminRole = roleRepository.create({
      name: 'Administrador',
      code: 'ADMIN',
      description: 'Puede hacer todo',
    });
    roleAdmin = await roleRepository.save(newAdminRole);
  }

  let roleDealer = await roleRepository
    .createQueryBuilder()
    .where('code = :code', {
      code: 'DEALER',
    })
    .getOne();

  if (!roleDealer) {
    const newDealerRole = roleRepository.create({
      name: 'Distribuidor',
      code: 'DEALER',
      description: 'This is a dealer',
    });
    roleDealer = await roleRepository.save(newDealerRole);
  }

  const roleUser = await roleRepository
    .createQueryBuilder()
    .where('code = :code', {
      code: 'USER',
    })
    .getOne();

  if (!roleUser) {
    const newRoleUser = roleRepository.create({
      name: 'Usuario',
      code: 'USER',
      description: 'usuario restringido',
    });
    await roleRepository.save(newRoleUser);
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
