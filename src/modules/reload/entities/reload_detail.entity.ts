import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Reload } from './reload.entity';

@Entity({ name: 'reload_details' })
export class ReloadDetail extends GenericEntity {
  @Column()
  subtotal: number;

  @Column()
  cant: number;

  @Column({ default: 0 })
  cant_sold: number;

  @ManyToOne(() => Reload, (reloads) => reloads.reloadDetails)
  reload: Reload;

  @ManyToOne(() => Product, (product) => product.reloadDetails)
  product: Product;
}
