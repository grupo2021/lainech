import { GenericEntity } from 'src/modules/genericEntity.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile extends GenericEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  phones: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  identificationNumber: string;

  @Column({ nullable: true })
  photo: string;
}
