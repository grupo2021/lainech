import { Category } from 'src/modules/categories/entities/category.entity';
import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Lote } from 'src/modules/lote/entities/lote.entity';
import { ReloadDetail } from 'src/modules/reload/entities/reload_detail.entity';
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

  @Column({ default: 50 })
  profit: number;

  @Column()
  image: string;

  @Column({ default: 1 })
  price: number;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Lote, (lote) => lote.product, { cascade: true })
  lotes: Lote[];

  @OneToMany(() => ReloadDetail, (reloadDetail) => reloadDetail.reload)
  reloadDetails: ReloadDetail[];
}
