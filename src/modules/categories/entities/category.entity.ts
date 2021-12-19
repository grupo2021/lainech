import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends GenericEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  touppercase() {
    this.code = this.code.toUpperCase();
  }
}
