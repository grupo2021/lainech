import { Role } from '../../role/entities/role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PasswordEncrypter } from '../../../utils/password-encrypter';
import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Reload } from 'src/modules/reload/entities/reload.entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
}

@Entity('users')
export class User extends GenericEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserStatus.ACTIVE })
  status: UserStatus;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Reload, (reload) => reload.user)
  reloads: Reload[];

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;

  authenicate(password: string): boolean {
    return PasswordEncrypter.compare(password, this.password);
  }

  @BeforeInsert()
  private setCreateDate(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedAt = new Date();
  }
}
