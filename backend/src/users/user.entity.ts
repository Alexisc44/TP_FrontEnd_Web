
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  
  @Column({ default: true })
  age: number
  
  @Column()
  @Exclude()
  password: string;

  constructor(id: number, lastname: string, firstname: string, age: number, password: string) {
    this.id = id;
    this.lastname = lastname;
    this.firstname = firstname;
    this.age = age
  }
}

