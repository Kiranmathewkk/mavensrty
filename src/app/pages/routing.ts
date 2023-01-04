import { Routes } from '@angular/router';
import { RoleguardGuard } from '../roleguard.guard';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      canActivate:[RoleguardGuard],
      data:{
        expectedRoles: ['ENTREPRENEUR']
      }
  },
  {
    path: 'backend/dashboard',
    loadChildren: () =>
      import('./backend-dashboard/backenddashboard.module').then((m) => m.BackendDashboardModule),
      canActivate:[RoleguardGuard],
      data:{
        expectedRoles: ['PLATFORM_ADMIN','BACKEND_ADMIN']
      }
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
      canActivate:[RoleguardGuard],
      data:{
        expectedRoles: ['PLATFORM_ADMIN','BACKEND_ADMIN']
      }
  },
  {
    path: 'backendbussiness',
    loadChildren: () =>
      import('./backend-company/backendcompany.module').then((m) => m.BackendCompanyModule),
      canActivate:[RoleguardGuard],
      data:{
        expectedRoles: ['PLATFORM_ADMIN','BACKEND_ADMIN']
      }
  },
  {
    path: 'companies',
    loadChildren: () =>
      import('./companies/companies.module').then((m) => m.CompaniesModule),
      canActivate:[RoleguardGuard],
      data:{
        expectedRoles: ['ENTREPRENEUR']
      }
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
