import { Client } from 'src/modules/clients/entities/client.entity';
import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { SaleDetail } from './sale-details.entity';

export enum SaleStatus {
  ANULADO = 'ANULADO',
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
}

@Entity('sales')
export class Sale extends GenericEntity {
  @Column()
  date: Date;

  @Column()
  total: number;

  @Column({ default: SaleStatus.PENDIENTE })
  status: SaleStatus;

  @ManyToOne(() => Client, (client) => client.sales)
  client: Client;

  @OneToMany(() => SaleDetail, (saleDetails) => saleDetails.sale, {
    cascade: true,
  })
  saleDetails: SaleDetail[];
}
