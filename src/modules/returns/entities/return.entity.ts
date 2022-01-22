import { GenericEntity } from 'src/modules/genericEntity.entity';
import { PromotorProduct } from 'src/modules/promotor-product/entities/promotor-product.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum ReturnStatus {
  APROVADO = 'APROBADO',
  PENDIENTE = 'PENDIENTE',
  ANULADO = 'ANULADO',
}

@Entity({ name: 'returns' })
export class Return extends GenericEntity {
  @Column()
  date: Date;

  @Column()
  cant: number;

  @Column()
  description: string;

  @Column({ default: ReturnStatus.PENDIENTE })
  status: ReturnStatus;

  @Column({ nullable: true })
  cancelled_description: string;

  @OneToOne(
    () => PromotorProduct,
    (promotorProduct) => promotorProduct.returns,
    { cascade: true },
  )
  @JoinColumn()
  promotorProduct: PromotorProduct;

  @ManyToOne(() => User, (user) => user.almacenero_returns)
  almacenero: User;
}
