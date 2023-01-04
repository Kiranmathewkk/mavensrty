import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { components } from 'src/app/_metronic/kt';
import { CompaniesComponent } from './companies.component';
import { CompanyListomponent } from './company-list/company-list.component';
import { CompanyWizardComponent } from './company-wizard/company-wizard.component';
import { Step4Component } from 'src/app/modules/wizards/steps/step4/step4.component';
import { FormGuard } from '../../form-guard.guard'

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
    children: [
      {
        path: 'form/:id',
        canDeactivate:[FormGuard],
        component: CompanyWizardComponent,
        
      },
      {
        path: 'list',
        component: CompanyListomponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
