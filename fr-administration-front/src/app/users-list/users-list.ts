import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export class User {
  constructor(
    public id: number,
    public password: string,
    public lastname: string,
    public firstname: string,
    public age: number
  ) {}
}

const users: User[] = [
  new User(0, 'mdp1', 'Doe', 'John', 23),
  new User(1, 'mdp2', 'Doe', 'Jane', 32)
];

@Component({
  imports: [MatTableModule],
  selector: 'app-users-list',
  styleUrl: './users-list.scss',
  templateUrl: './users-list.html',
})
export class UsersList {
  displayedColumns: string[] = ['id', 'lastname', 'firstname', 'age'];
  dataSource = users;
  readonly users = users;
}
