import { SetMetadata } from '@nestjs/common';

export enum RoleOptions {
  User = 'USER',
  Admin = 'ADMIN',
  Promotor = 'PROMOTOR',
  Almacenero = 'ALMACENERO',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleOptions[]) => SetMetadata(ROLES_KEY, roles);
