import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackendDashboardComponent } from './backenddashboard.component';
import { WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';

@NgModule({
  declarations: [BackendDashboardComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: BackendDashboardComponent,
      },
    ]),
    WidgetsModule,
  ],
})
export class BackendDashboardModule {}
