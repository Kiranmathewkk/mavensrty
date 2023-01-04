import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CompaniesComponent } from './companies.component';
import { WidgetsExamplesModule } from 'src/app/modules/widgets-examples/widgets-examples.module';
import { DropdownMenusModule, ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { WizardsModule } from 'src/app/modules/wizards/wizards.module';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompanyWizardComponent } from './company-wizard/company-wizard.component';
import { CompanyListomponent } from './company-list/company-list.component';


@NgModule({
  declarations: [CompaniesComponent , CompanyWizardComponent , CompanyListomponent],
  imports: [
    CommonModule,
    FormsModule,
    ModalsModule,
    InlineSVGModule,
    WizardsModule,
    NgbTooltipModule,
    CompaniesRoutingModule,
    WidgetsModule,DropdownMenusModule,
    ReactiveFormsModule,
   
  ],
})
export class CompaniesModule {}
