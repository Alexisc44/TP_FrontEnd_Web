import { Routes } from '@angular/router';
import { UsersList } from './users-list/users-list';
import { Login } from './login/login';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
  { path: 'users', component: UsersList, canActivate: [authGuard] },
  { path: '', component: Login }
];
