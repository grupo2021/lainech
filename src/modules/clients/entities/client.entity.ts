import { GenericEntity } from 'src/modules/genericEntity.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.clients, { nullable: true })
  user: User;
}
