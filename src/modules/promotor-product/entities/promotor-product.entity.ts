import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Return } from 'src/modules/returns/entities/return.entity';
import { SaleDetail } from 'src/modules/sales/entities/sale-details.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'promotor_products' })
export class PromotorProduct extends GenericEntity {
  @Column()
  cant: number;

  @Column({ default: 0 })
  cant_out: number;

  @Column({ default: 0 })
  cant_returned: number;

  @ManyToOne(() => Product, (product) => product.promotorProducts)
  product: Product;

  @ManyToOne(() => User, (user) => user.promotorProducts)
  user: User;

  @OneToMany(() => SaleDetail, (saleDetails) => saleDetails.sale)
  saleDetails: SaleDetail[];

  @OneToMany(() => Return, (returns) => returns.promotorProduct)
  returns: Return;
}
