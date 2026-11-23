export class Member {
  name: string;
  firstname: string;
  age: number;
  role: string | null;

  constructor(
    name: string,
    firstname: string,
    age: number,
    role: string | null,
  ) {
    this.name = name;
    this.firstname = firstname;
    this.age = age;
    this.role = role;
  }
}
