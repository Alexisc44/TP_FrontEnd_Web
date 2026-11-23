import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Association {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, { eager: true })
  
  @JoinTable()
  users: User[];


  constructor(id: number, users: User[], name: string){
    this.id = id;
    this.users = users;
    this.name = name;
  }
}

