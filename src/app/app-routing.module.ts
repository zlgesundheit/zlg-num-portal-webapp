import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './core/auth/guards/auth.guard'
import { RoleGuard } from './core/auth/guards/role.guard'

const routes: Routes = [
  {
    path: 'home',
    canLoad: [AuthGuard],
    data: {
      navId: 'home',
    },
    loadChildren: () =>
      import(
        /* webpackChunkName: "Dashboard.Module" */ './modules/dashboard/dashboard.module'
      ).then((m) => m.DashboardModule),
  },
  {
    path: 'studies',
    canLoad: [AuthGuard, RoleGuard],
    data: {
      navId: 'studies',
      roles: [],
    },
    loadChildren: () =>
      import(/* webpackChunkName: "Studies.Module" */ './modules/studies/studies.module').then(
        (m) => m.StudiesModule
      ),
  },
  {
    path: 'phenotypes',
    canLoad: [AuthGuard, RoleGuard],
    data: {
      navId: 'phenotypes',
      roles: [],
    },
    loadChildren: () =>
      import(
        /* webpackChunkName: "Phenotypes.Module" */ './modules/phenotypes/phenotypes.module'
      ).then((m) => m.PhenotypesModule),
  },
  {
    path: 'cohorts',
    canLoad: [AuthGuard, RoleGuard],
    data: {
      navId: 'cohorts',
      roles: [],
    },
    loadChildren: () =>
      import(/* webpackChunkName: "Cohorts.Module" */ './modules/cohorts/cohorts.module').then(
        (m) => m.CohortsModule
      ),
  },
  {
    path: 'aqls',
    canLoad: [AuthGuard, RoleGuard],
    data: {
      navId: 'aqls',
      roles: [],
    },
    loadChildren: () =>
      import(/* webpackChunkName: "Aqls.Module" */ './modules/aqls/aqls.module').then(
        (m) => m.AqlsModule
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
