import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'login', loadComponent: () => import('./login/login.component').then(mod => mod.LoginComponent)},
    {path: 'list', loadComponent: () => import('./list/list.component').then(mod => mod.ListComponent)}
];
