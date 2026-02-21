import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'today',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'today',
        loadComponent: () =>
          import('./features/today/today.component').then((m) => m.TodayComponent),
      },
      {
        path: 'habits',
        loadComponent: () =>
          import('./features/habits/habit-list/habit-list.component').then(
            (m) => m.HabitListComponent,
          ),
      },
      {
        path: 'habits/new',
        loadComponent: () =>
          import('./features/habits/habit-form/habit-form.component').then(
            (m) => m.HabitFormComponent,
          ),
      },
      {
        path: 'habits/:id/edit',
        loadComponent: () =>
          import('./features/habits/habit-form/habit-form.component').then(
            (m) => m.HabitFormComponent,
          ),
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('./features/stats/stats.component').then((m) => m.StatsComponent),
      },
      {
        path: 'weight',
        loadComponent: () =>
          import('./features/weight/weight.component').then((m) => m.WeightComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'today' },
];
