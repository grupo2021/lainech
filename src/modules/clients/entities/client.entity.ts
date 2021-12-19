import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'clients' })
export class Client extends GenericEntity {
  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  address: string;

  @Column()
  phones: string;
}
