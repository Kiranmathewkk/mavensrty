import { Component, Input, OnDestroy, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { CompaniesService } from '../../../../pages/companies/companies.service';
import { HttpClient,HttpHeaders ,HttpRequest } from '@angular/common/http';
import { Globalervice } from '../../../../global.service';
import * as $ from 'jquery';
// import { json } from 'stream/consumers';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
})
export class Step4Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
defaultValues:  any= {  accountType: 'personal',
accountTeamSize: '50+',
accountName: '',
accountPlan: '1',
businessName: 'Keenthemes Inc.',
businessDescriptor: 'KEENTHEMES',
businessType: '1',
businessDescription: '',
businessEmail: 'corp@support.com',
nameOnCard: 'Max Doe',
cardNumber: '4111 1111 1111 1111',
cardExpiryMonth: '1',
cardExpiryYear: '2',
cardCvv: '123',
saveCard: '1'}

  private unsubscribe: Subscription[] = [];
  url:any;
  showCompany: boolean = false;
  showPartner: boolean = false;
  uploadedDoc: any=[];
  viewMode=0;
  obj:any = sessionStorage.getItem('userDetails');
  
  formJson:any;
  businessId:any;
  partnerData:any=[];
  file:File;
  file1:any;
  url1:any;
  companyOption:any;
  isPartnerDoc:boolean=false;
  constructor(private fb: FormBuilder,private companiesService:CompaniesService,
    private http:HttpClient,private cdr: ChangeDetectorRef,private globalService:Globalervice) {}

  ngOnInit() {
    // this.initForm();
    
   
    
    if(this.obj){
      this.formJson = JSON.parse(this.obj)
      // this.isFormData = true
      this.valueToForm()
      this.updateParentModel({}, false);
    }

  }
  load(widgetId:any) {
    
    this.globalService.FreshworksWidget(widgetId);
  }

  // initForm() {
  //   this.form = this.fb.group({
  //     nameOnCard: [this.defaultValues.nameOnCard, [Validators.required]],
  //     cardNumber: [this.defaultValues.cardNumber, [Validators.required]],
  //     cardExpiryMonth: [
  //       this.defaultValues.cardExpiryMonth,
  //       [Validators.required],
  //     ],
  //     cardExpiryYear: [
  //       this.defaultValues.cardExpiryYear,
  //       [Validators.required],
  //     ],
  //     cardCvv: [this.defaultValues.cardCvv, [Validators.required]],
  //     saveCard: ['1'],
  //   });

  //   const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
  //     this.updateParentModel(val, this.checkForm());
  //   });
  //   this.unsubscribe.push(formChangesSubscr);
  // }
  

  // checkForm() {
  //   return !(
  //     this.form.get('nameOnCard')?.hasError('required') ||
  //     this.form.get('cardNumber')?.hasError('required') ||
  //     this.form.get('cardExpiryMonth')?.hasError('required') ||
  //     this.form.get('cardExpiryYear')?.hasError('required') ||
  //     this.form.get('cardCvv')?.hasError('required')
  //   );
  // }

  onSelectFile(event:any,val:any) {
    // this.file={}
    if (event.target.files && event.target.files[0]) {
     if(val == 1){
      
     this.file = event.target.files[0]
     var reader = new FileReader();
      this.formJson.addressFileName =  event.target.files[0].name
     reader.readAsDataURL(event.target.files[0]); // read file as data url

     reader.onload = (event:any) => { // called once readAsDataURL is completed
       this.url = event.target.result;
     }
     this.uploadAddres();
     }
    //  else{
      
    //   this.file1 = event.target.files[0]
    //   var reader = new FileReader();

    //   reader.readAsDataURL(event.target.files[0]); // read file as data url

    //   reader.onload = (event:any) => { // called once readAsDataURL is completed
    //     this.url1 = event.target.result;
    //   }
    //   this.uploadNoc();

    //  }

      
    }
  }
  partnerDoc(event:any,val:any,index:any){
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const email = this.partnerData[index].email.email

      if(val == 1){
        // console.log("partner",partner)
      
        this.companiesService.uploadPartnerPan(file,email).then((res)=>{
          this.partnerData[index].panUpload = true;
          this.cdr.detectChanges();
          // console.log(this.partnerData[index])

        },(e)=>{
           console.log("error");
        })


      }if(val == 2){
        this.companiesService.uploadPartnerAadhar(file,email).then((res)=>{
          this.partnerData[index].aadharUpload = true;
          this.cdr.detectChanges();
        },(e)=>{
          console.log("error");
        })


      }if(val == 3){

          this.companiesService.uploadPartnerSupport(file,email).then((res)=>{
            this.partnerData[index].supportDoc = true;
            this.cdr.detectChanges();
          },(e)=>{
            console.log("error");
          })
      }
          
      
    }
  }

  valueToForm(){
    
    this.formJson['compAdress'] = false;
    this.formJson['compNoc']  = false;
    if(this.formJson.partners.length){
      this.partnerData=this.formJson.partners;
      for(let partner of this.partnerData){
        partner['panUpload'] = false;
        partner['aadharUpload'] = false;
        partner['supportDoc'] = false;
      }
    }
    this.cdr.detectChanges();
  }
  uploadAddres(){
  //  console.log("bussiness",this.businessId)
  //  console.log("bussiness",this.businessId['id'])
    const httpOptions = {
      headers: new HttpHeaders({
       "Content-Type": "multipart/form-data" ,
      
      })
    };
    
    const formdata: FormData = new FormData();
      formdata.append('file', this.file);
      

      const response = this.companiesService.uploadCompanyAddressDoc(this.file).then((res)=>{
        // console.log("responseeeee",res.statuscode);
        this.formJson.compAdress = true;
        this.cdr.detectChanges();
        // console.log(this.formJson);
        // console.log(this.formJson.compAdress,this.formJson.compNoc)
        if(this.formJson.compAdress == true && this.isPartnerDoc == true){
          // console.log("true")
          this.updateParentModel({}, true);
         }

      },(e)=>{
           console.log("error")
      })
      
     
  }
  uploadNoc(){
    const formdata: FormData = new FormData();
    formdata.append('file', this.file1);

    const response = this.companiesService.uploadCompanyNocDoc(this.file1).then((res)=>{
      this.formJson.compNoc = true;
      this.cdr.detectChanges();
      // console.log(this.formJson);
      // console.log(this.formJson.compAdress,this.formJson.compNoc)
      if(this.formJson.compAdress ==true && this.formJson.compNoc==true){
        // console.log("true")
        this.updateParentModel({}, true);
       }
    },(e)=>{
      console.log("error")
    })

    
    
  }
  docSelected(val:any){
    if(val == 1){
      this.showCompany = true;
        this.showPartner =  false;
    }else{
      this.showCompany = false;
        this.showPartner =  true;
    }

  }
  partnerDocStatus=(status:boolean)=>{
    // console.log("partnerStatus called");
    this.isPartnerDoc = status;
    if(this.formJson.compAdress == true && this.isPartnerDoc == true){
      // console.log("Parent documnt status",status);
      this.updateParentModel({}, true);
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
