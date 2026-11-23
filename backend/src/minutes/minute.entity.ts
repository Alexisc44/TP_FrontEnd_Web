
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable, ManyToOne } from "typeorm";
import { Association } from '../associations/association.entity';
import { User } from "../users/user.entity";

@Entity()
export class Minute {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToMany(() => User, { eager: true })

  @JoinTable()
   voters: User[];

  @Column({ default: true })
  date: string;

  @ManyToOne(() => Association, { eager: true })
  
  @JoinTable()
   association: Association;

  constructor(id: number, content: string, voters: User[], date: string, association: Association){
    this.id = id;
    this.content = content;
    this.voters = voters;
    this.date = date;
    this.association = association;
  }
}