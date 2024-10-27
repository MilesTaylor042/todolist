import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo:'/login', pathMatch:'full'},
    {path: 'login', title: 'Login', loadComponent: () => import('./login/login.component').then(mod => mod.LoginComponent)},
    {path: 'list', title: 'To Do List', loadComponent: () => import('./list/list.component').then(mod => mod.ListComponent)}
];
