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
import { PromotorProduct } from 'src/modules/promotor-product/entities/promotor-product.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Sale } from 'src/modules/sales/entities/sale.entity';

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

  @OneToMany(() => PromotorProduct, (promotorProduct) => promotorProduct.user, {
    cascade: true,
  })
  promotorProducts: PromotorProduct[];

  @OneToMany(() => Reload, (reload) => reload.user)
  reloads: Reload[];

  @OneToMany(() => Sale, (sale) => sale.client, { cascade: true })
  sales: Sale[];

  @OneToMany(() => Client, (client) => client.user, { cascade: true })
  clients: Client[];

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
