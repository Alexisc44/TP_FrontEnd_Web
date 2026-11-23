import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Association } from '../associations/association.entity';
import { User } from '../users/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Association, { eager: true})
  @JoinColumn({ name: 'associationId' })
  association: Association;

  constructor(id: number, name: string, user: User, association: Association) {
    this.id = id;
    this.name = name;
    this.user = user;
    this.association = association;
  }
}
