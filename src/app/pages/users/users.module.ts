import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UsersComponent } from './users.component';
import { WidgetsExamplesModule } from 'src/app/modules/widgets-examples/widgets-examples.module';
import { DropdownMenusModule, ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ModalsModule,
    InlineSVGModule,
    NgbTooltipModule,
    WidgetsModule,DropdownMenusModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsersComponent,
      },
    ]),
  ],
})
export class UsersModule {}
