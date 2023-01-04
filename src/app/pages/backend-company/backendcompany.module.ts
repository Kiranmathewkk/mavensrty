import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BackendCompanyComponent } from './backendcompany.component';
import { WidgetsExamplesModule } from 'src/app/modules/widgets-examples/widgets-examples.module';
import { DropdownMenusModule, ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [BackendCompanyComponent,],
  imports: [
    CommonModule,
    FormsModule,
    ModalsModule,
    InlineSVGModule,
    NgbTooltipModule,
    WidgetsModule,DropdownMenusModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbDatepickerModule,
    RouterModule.forChild([
      {
        path: '',
        component: BackendCompanyComponent,
      },
    ]),
  ],
})
export class BackendCompanyModule {}
