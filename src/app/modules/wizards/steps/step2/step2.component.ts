import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HelperService } from 'src/app/helper.service';
import { CompaniesService } from 'src/app/pages/companies/companies.service';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { ModalComponent } from 'src/app/_metronic/partials/layout/modals/modal/modal.component';
import { ICreateAccount } from '../../create-account.helper';
import { ToastService }  from '../../../auth/services/toast.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { getLocaleDateFormat } from '@angular/common';
import { Globalervice } from '../../../../global.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: (
    partners: any,
    isFormValid: boolean,
    edit?:number
  ) => void;
  form: FormGroup;
  share:any =0;
  partnersList : any=[];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  formData: any ={};
  isShareZero:boolean =false;
  stakeHolderCount:number = 0;
  stakeCount:number = 0;
  obj:any = sessionStorage.getItem('userDetails');
  formJson:any={};
  editPartnerIndex:any;
  modalConfig: ModalConfig = {
    modalTitle: 'Add Partner ',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  errorList:any=[];
  maxdate:any={};
  stateList:any=[];
  model: NgbDateStruct;
  @ViewChild('modal') private modalComponent: ModalComponent;
  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder , private helperService:HelperService , 
    private companiesService:CompaniesService,private cdr: ChangeDetectorRef,
    private toaster : ToastService, private globalService:Globalervice) {
    this.formData = this.companiesService.company$.getValue();
    // this.formData.type
    if(this.formData.type == 'OPC'){
      this.stakeHolderCount = 1;
      this.formJson["disableStakeCount"]=true;
    }
    // else{
    //   this.formJson["disableStakeCount"]=false;
    //   this.stakeHolderCount = 2;
    // }
  }

  ngOnInit() {
    this.initForm();
    this.maxDate();
    this.updateParentModel({}, false);

    if(this.obj){
      this.formJson = JSON.parse(this.obj)
      // this.isFormData = true
      this.valueToForm()
    }
  }

  initForm() {
    this.form = this.fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3)
          ]),
        ],
        middleName: [
          '',
          Validators.compose([
   
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3)
          ]),
        ],
        role: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        share: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        gender: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        dob:[
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        placeOfBirth:[
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        educationalQualification:[
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        occupation:[
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        nationality:[
          '',
       
        ],
        din:[
          '',
          
        ],
        fatherName: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        address_line1: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        address_line2: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        address_state: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        address_country: [
          '',
          
        ],
        address_pin: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[1-9]{1}[0-9]{5}$/)
          ]),
        ],
        mobile: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[6-9]{1}[0-9]{9}$/)
          ]),
        ],
        pan: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
          ]),
        ],
        aadhaar: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[2-9]{1}[0-9]{11}$/)
          ]),
        ]
        ,   email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
          ]),
        ]
    
     
      }
    );
    this.getStateList()
  }

  load(widgetId:any) {
    
    this.globalService.FreshworksWidget(widgetId);
  }

  checkForm() {
    return !this.form.get('accountName')?.hasError('required');
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  submit() {

  }
  get f() {
    return this.form.controls;
  }
  valueToForm(){
    this.errorList=['Total shares must be equls to 100','Must contain one Director ','On Private Limited StakeHolder must be 2 or greater']
    // console.log("partner list",this.partnersList);
    if(this.formJson.partners && this.formJson.partners.length){
      this.partnersList = this.formJson.partners
      for(let partner of this.formJson.partners){
        this.share = partner.share+this.share
        // this.updateParentModel(partner,false);
        // if(this.share == 100){
        //   this.updateParentModel(partner,true);
        // }else{
        //   this.updateParentModel(partner,false);
        // }
        
        
      }
      if(this.share == 100){
        
        // this.updateParentModel({},true);
        if(this.formJson.type == "PVT_LTD"){
          if(this.partnersList.length>1){
            // console.log("length greater than 2");
            this.errorList.splice(2,1);
            // console.log("managing derector",this.errorList)
            for(let partner of this.partnersList){
              // console.log("Let partner one by one",partner);
              if(partner.role == "MANAGING_DIRECTOR" || partner.role =="DIRECTOR_AND_SHARE_HOLDER"){
                // console.log("managing derector")
                this.updateParentModel({},true);
                this.errorList=[];
                break;
              }
            }
            this.cdr.detectChanges();
          }
        }
      }
     
    }
   

  }
  
  saveSettings() {
    this.errorList=['Total shares must be equls to 100','Must contain one Director ','On Private Limited StakeHolder must be 2 or greater']
    this.cdr.detectChanges();
    // console.log("typeee",this.form.value.role,"2",this.formData.type);
    if(this.form.valid) {
      
       
      let partner = this.helperService.processFormData(this.form.value);
      if(this.isShareZero){
        partner['share']=0;
      }
      
      //  {year: 2022, month: 11, day: 11}
      let date = new Date(partner['dob']['year'],partner['dob']['month'],partner['dob']['day'])
      // console.log("date",date)
      partner['dob'] = date;
      this.share = partner.share+this.share;
      // console.log("shere",this.share)
      if(this.share >100){
         this.share= this.share - partner.share;
        this.toaster.showError("Total Share must not greater than 100")
        return false;
        
      }
      if(this.editPartnerIndex != undefined){

        this.partnersList.splice(this.editPartnerIndex,1,partner);
        // this.partnersList.push(partner);
      }else{
        this.partnersList.push(partner);
        this.stakeCount++;
      }
      // console.log("partner",partner);
      
      
      this.updateParentModel(partner,false,this.editPartnerIndex);
      
      this.editPartnerIndex = undefined ;
     
      if(this.share == 100){
        this.errorList.splice(0,1);
        // console.log("share == 100")
        if(this.formData.type == 'OPC'){
          this.errorList=[];
          this.updateParentModel({},true);
        }

        if(this.formData.type == 'PVT_LTD'){
          // console.log("PVT_LTD");
          // console.log("managing derector",this.errorList)
          if(this.partnersList.length>1){
            // console.log("length greater than 2");
            this.errorList.splice(2,1);
            // console.log("managing derector",this.errorList)
            for(let partner of this.partnersList){
              // console.log("Let partner one by one",partner);
              if(partner.role == "MANAGING_DIRECTOR" || partner.role =="DIRECTOR_AND_SHARE_HOLDER"){
                // console.log("managing derector")
                this.updateParentModel({},true);
                this.errorList=[];
                break;
              }
            }
            this.cdr.detectChanges();
          }
          
        }
        
      }
        //  console.log("index dataaaa",this.editPartnerIndex)
      this.cdr.detectChanges();
      this.onCancel();
      // if(this.stakeHolderCount != this.stakeCount){
      //   this.onAddForm()
      // }
    }else {
      console.log("Form ***"  ,  this.form)
    }
    
  }
  onCancel() {
    this.modalComponent.close();
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
  selectedRole(){
    if(this.form.value.role=="MANAGING_DIRECTOR"){
      this.form.controls['share'].setValue(0)
      this.form.controls['share'].disable();
      this.isShareZero = true;
    }else{
      this.form.controls['share'].setValue('');
      this.form.controls['share'].enable();
      this.isShareZero = false;
    }
  }


  async onAddForm() {
    this.form.reset();
    if(this.formData.type == "OPC"){
     
      
      this.formJson['disableShare'] = true;
      this.formJson['disableRole'] = true;
      this.form.controls['share'].setValue(100);
      this.form.controls['role'].setValue('DIRECTOR_AND_SHARE_HOLDER');
      // this.form.controls['role'].disable();
      // this.form.controls['share'].disable();
      
      this.cdr.detectChanges();

    }
    if(this.formData.type == "PVT_LTD" && this.stakeHolderCount == 2 ){
      // console.log("yessssssssssss")
       
      this.formJson['disableRole'] = true;
      this.formJson['disableShare'] = null;
      this.form.controls['role'].setValue('DIRECTOR_AND_SHARE_HOLDER');
      this.cdr.detectChanges();
    }
    if(this.stakeHolderCount > 2){
      this.formJson['disableRole'] = null;
      this.formJson['disableShare'] = null;
      this.cdr.detectChanges();
    }
    
    this.form.controls['address_country'].setValue("India");
    this.form.controls['nationality'].setValue("India")
    
    return await this.modalComponent.open({ "modalDialogClass" : "modal-lg"}  );
  }
  async editPartner(partner:any,index:any){
    // console.log(partner);
    this.share = this.share-partner?.share;
    this.editPartnerIndex=index;
    let dateOf = new Date(partner?.dob)
    let day = dateOf.getDate();
    let month = dateOf.getMonth();
    let year = dateOf.getFullYear()
    let fullDate = {
      year:year,
      month:month,
      day:day

    }
    let middleNmae
    if(partner.middleName == null){
      middleNmae = partner?.middleName
    }else{
      middleNmae = partner?.middleName.name;
    }

    
    // console.log(day,month,year)

   
    this.form.setValue({firstName: partner?.firstName.name,
         
      middleName: middleNmae,
      lastName: partner?.lastName.name,
      role: partner?.role,
      share: partner?.share,
      gender: partner?.gender,
      dob: fullDate,
      placeOfBirth: partner?.placeOfBirth,
      educationalQualification: partner?.educationalQualification,
      occupation: partner?.occupation,
      nationality: partner?.nationality,
      din: partner?.din,
      fatherName: partner?.fatherName,
      address_line1:  partner?.address.line1,
      address_line2: partner?.address.line2,
      address_state: partner?.address.state,
      address_country: partner?.address.country,
      address_pin: partner?.address.pin,
      mobile:  partner?.mobile.number,
      pan: partner?.pan,
      aadhaar: partner?.aadhaar,
      email: partner?.email.email });

      return await this.modalComponent.open({ "modalDialogClass" : "modal-lg"}  );

  }
  maxDate(){
    let today = new Date()
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear()
    this.maxdate={
      year:year-18,
      month:month,
      day:day
    }

  }
}
