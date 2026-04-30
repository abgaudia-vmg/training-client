import { Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';
import { AdminGuard } from './common/guards/admin.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    },
    // {
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full',
    // },
    {
        path: 'tasks',
        loadComponent: () => import('./tasks/pages/pages.page').then(m => m.PagesPage)
    },
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth/login',
        loadComponent: () => import('./auth/pages/login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'auth/reset-password',
        loadComponent: () => import('./auth/pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage)
    },
    {
        path: 'auth/reset-password/success',
        loadComponent: () =>
            import('./auth/pages/reset-password-success/reset-password-success.page').then(
                (module) => module.ResetPasswordSuccessPage,
            ),
    },
    {
        path: 'auth/register',
        loadComponent: () =>
            import('./auth/pages/register/register.page').then(
                (m) => m.RegisterPage,
            ),
    },
    {
        path: 'auth/register/success',
        loadComponent: () =>
            import('./auth/pages/register-success/register-success.page').then(
                (m) => m.RegisterSuccessPage,
            ),
    },
    {
        path: 'user-management/view-all',
        canActivate: [AuthGuard, AdminGuard],
        loadComponent: () => import('./user-management/pages/view-all/user-management.view-all.page').then(m => m.UserManagementViewAllPage)
    },
    {
        path: 'user-management/add',
        canActivate: [AuthGuard, AdminGuard],
        loadComponent: () => import('./user-management/pages/user-form/user-form.page').then(m => m.UserFormPage)
    },
    {
        path: 'user-management/edit/:id',
        canActivate: [AuthGuard, AdminGuard],
        loadComponent: () => import('./user-management/pages/user-form/user-form.page').then(m => m.UserFormPage)
    },
    {
        path: 'todos/my-todos',
        canActivate: [AuthGuard],
        loadComponent: () => import('./todos/pages/my-todos/todos.my-todos.page').then(m => m.TodosMyTodosPage)
    },
    {
        path: 'todos/all-users',
        canActivate: [AuthGuard, AdminGuard],
        loadComponent: () => import('./todos/pages/all-users/todos.all-users.page').then(m => m.TodosAllUsersPage)
    },
];
