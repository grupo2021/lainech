import { Category } from 'src/modules/categories/entities/category.entity';
import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Lote } from 'src/modules/lote/entities/lote.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'products' })
export class Product extends GenericEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  description: string;

  @Column()
  basePrice: number;

  @Column()
  salePrice: number;

  @Column()
  stock: number;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Lote, (lote) => lote.product)
  lotes: Lote[];
}
