import { GenericEntity } from 'src/modules/genericEntity.entity';
import { PromotorProduct } from 'src/modules/promotor-product/entities/promotor-product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Sale } from './sale.entity';

@Entity({ name: 'sale_details' })
export class SaleDetail extends GenericEntity {
  @Column()
  subtotal: number;

  @Column()
  cant: number;

  @Column()
  precio_unitario: number;

  @ManyToOne(
    () => PromotorProduct,
    (promotorProduct) => promotorProduct.saleDetails,
  )
  promotorProduct: PromotorProduct;

  @ManyToOne(() => Sale, (sale) => sale.saleDetails)
  sale: Sale;
}
