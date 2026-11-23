import { Routes } from '@angular/router';
import { UsersList } from './users-list/users-list';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'users', component: UsersList },
  { path: '', component: Login }
];
