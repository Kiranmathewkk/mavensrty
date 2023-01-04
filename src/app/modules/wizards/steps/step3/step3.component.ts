import { Component, Input, OnDestroy, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import {CompaniesService } from  'src/app/pages/companies/companies.service';
import { Globalervice } from '../../../../global.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  communicationForm: FormGroup;
  stateList:any =[];

  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder,private companiesService:CompaniesService,
    private cdr: ChangeDetectorRef, private globalService:Globalervice ) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel({},true);
    this.valueToForm()
  }

  initForm() {
    this.form = this.fb.group(
      {
        reg_address_line1: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        reg_address_line2: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        reg_address_state: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        reg_address_country: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        reg_address_pin: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[1-9]{1}[0-9]{5}$/)
          ]),
        ],
           comm_address_line1: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        comm_address_line2: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        comm_address_state: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        comm_address_country: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        comm_address_pin: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[1-9]{1}[0-9]{5}$/)
          ]),
        ],
        registeredMobile: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[6-9]{1}[0-9]{9}$/)
          ]),
        ],
     
        registeredEmail: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
          ]),
        ]
     
      }
    );
    
   
    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      // console.log("step-3",this.form.valid)
      this.updateParentModel(val, this.form.valid);
    });
    this.unsubscribe.push(formChangesSubscr);
  }
  load(widgetId:any) {
    
    this.globalService.FreshworksWidget(widgetId);
  }
  valueToForm(){
    this.form.controls['reg_address_country'].setValue("INDIA");
    this.form.controls['comm_address_country'].setValue("INDIA");
    this.getStateList();

  }
  checkForm() {
    return !this.form.get('accountName')?.hasError('required');
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  submit() {

  }
  getStateList() {
    this.stateList = this.companiesService.getStateList().subscribe((res: any) => {
      if (res) {
        this.stateList = res;
        this.cdr.detectChanges();
        // console.log("response data",this.industryList);
      }
    });
  }
  checkSelected(event:any){

   
    if (event.target.checked === true) {

      this.form.controls['comm_address_line1'].setValue(this.form.get('reg_address_line1')!.value);
      this.form.controls['comm_address_line2'].setValue(this.form.get('reg_address_line2')!.value);
      this.form.controls['comm_address_state'].setValue(this.form.get('reg_address_state')!.value);
      this.form.controls['comm_address_pin'].setValue(this.form.get('reg_address_pin')!.value);
      
          
      }else{
        this.form.controls['comm_address_line1'].setValue("");
        this.form.controls['comm_address_line2'].setValue("");
        this.form.controls['comm_address_state'].setValue("");
        this.form.controls['comm_address_pin'].setValue("");
      }
  }
  get f() {
    return this.form.controls;
  }


}
