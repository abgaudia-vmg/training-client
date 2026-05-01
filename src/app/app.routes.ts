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
        path: 'auth/register/success',
        loadComponent: () =>
            import('./auth/pages/register-success/register-success.page').then(
                (m) => m.RegisterSuccessPage,
            ),
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./auth/pages/login/login.page').then(m => m.LoginPage)
            },
            {
                path: 'reset-password',
                loadComponent: () => import('./auth/pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage)
            },
            {
                path: 'reset-password/success',
                loadComponent: () =>
                    import('./auth/pages/reset-password-success/reset-password-success.page').then(
                        (module) => module.ResetPasswordSuccessPage,
                    ),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./auth/pages/register/register.page').then(
                        (m) => m.RegisterPage,
                    ),
            },
        ]
    },
    {
        path: 'user-management',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'view-all',
                canActivate: [AdminGuard],
                loadComponent: () => import('./user-management/pages/view-all/user-management.view-all.page').then(m => m.UserManagementViewAllPage)
            },
            {
                path: 'add',
                canActivate: [AdminGuard],
                loadComponent: () => import('./user-management/pages/user-form/user-form.page').then(m => m.UserFormPage)
            },
            {
                path: 'edit/:id',
                canActivate: [AdminGuard],
                loadComponent: () => import('./user-management/pages/user-form/user-form.page').then(m => m.UserFormPage)
            },
        ],
    },
    {
        path: 'todos',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'my-todos',
                loadComponent: () => import('./todos/pages/my-todos/todos.my-todos.page').then(m => m.TodosMyTodosPage)
            },
            {
                path: 'all-users',
                canActivate: [AdminGuard],
                loadComponent: () => import('./todos/pages/all-users/todos.all-users.page').then(m => m.TodosAllUsersPage)
            },
        ],
    },
];
