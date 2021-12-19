import { GenericEntity } from 'src/modules/genericEntity.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends GenericEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @BeforeInsert()
  @BeforeUpdate()
  codeToUppercase() {
    this.code = this.code.trim().toUpperCase();
  }
}
