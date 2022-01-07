import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'lotes' })
export class Lote extends GenericEntity {
  @Column()
  code: string;

  @Column()
  cant: number;

  @Column({ default: 0 })
  cant_out: number;

  @Column()
  price: number;

  @Column()
  register: Date;

  @Column()
  expiry: Date;

  @ManyToOne(() => Product, (product) => product.lotes)
  product: Product;
}
