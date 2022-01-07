import { GenericEntity } from 'src/modules/genericEntity.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ReloadDetail } from './reload_detail.entity';

export enum ReloadStatus {
  ANULADO = 'ANULADO',
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
}

@Entity({ name: 'reloads' })
export class Reload extends GenericEntity {
  @Column()
  date: Date;

  @Column()
  total: number;

  @Column({ default: ReloadStatus.PENDIENTE })
  status: ReloadStatus;

  @OneToMany(() => ReloadDetail, (reloadDetail) => reloadDetail.reload, {
    cascade: true,
  })
  reloadDetails: ReloadDetail[];

  @ManyToOne(() => User, (user) => user.reloads)
  user: User;
}
