import { Component,ChangeDetectorRef,OnInit,OnDestroy,Input,ViewChild,ElementRef } from '@angular/core';
import { CompaniesService } from '../../../../pages/companies/companies.service'
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { Globalervice } from '../../../../global.service';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
})
export class Step6Component implements OnInit ,OnDestroy{
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  @Input('uploadPartnerDoc') uploadPartnerDoc:(
    status:boolean
  )=>void;
  obj:any = sessionStorage.getItem('userDetails');
  formJson:any;
  businessId:any;
  partnerData:any=[];
  private unsubscribe: Subscription[] = [];
  viewMode=0;
  showTab=0;
  @ViewChild('fileUploader') fileUploader:ElementRef;
  constructor(private cdr:ChangeDetectorRef,private companiesService:CompaniesService,private globalService:Globalervice) {}
  ngOnInit() {
    // console.log("loadded step-6")
    
    // console.log("loadded step-6")
    if(this.obj){
      this.formJson = JSON.parse(this.obj)
      // this.isFormData = true
      this.valueToForm()
      // this.updateParentModel({}, false);
      
    }

    
    // this.valueToForm()

  }

  load(widgetId:any) {
    
    this.globalService.FreshworksWidget(widgetId);
  }


  valueToForm(){

//  let   partner = [
//       {aadhaar: "235467635463",
// address: {pin: '678987', line1: 'sfsf', line2: 'sdf', state: 'Kerala', country: 'India'},
// din: null,
// dob: "",
// educationalQualification: "Graduation/Bachelor/Equivalent",
// email: {email: 'asds@s.com'},
// fatherName: "sdfsf",
// firstName: {name: 'asff'},
// gender: "MALE",
// lastName: {name: 'afs'},
// middleName: {name: 'saf'},
// mobile: {number: '6789876789'},
// nationality: "India",
// occupation: "Professional",
// pan: "XCVFA2435T",
// placeOfBirth: "asdasd",
// role: "MANAGING_DIRECTOR",
// share: 0},
// {
//   aadhaar: "235467635463",
// address: {pin: '678987', line1: 'sfsf', line2: 'sdf', state: 'Kerala', country: 'India'},
// din: null,
// dob: "",
// educationalQualification: "Graduation/Bachelor/Equivalent",
// email: {email: 'asds@s.com'},
// fatherName: "sdfsf",
// firstName: {name: 'asff'},
// gender: "MALE",
// lastName: {name: 'afs'},
// middleName: {name: 'saf'},
// mobile: {number: '6789876789'},
// nationality: "India",
// occupation: "Professional",
// pan: "XCVFA2435T",
// placeOfBirth: "asdasd",
// role: "MANAGING_DIRECTOR",
// share: 0
// }
//     ]
    // this.partnerData=    partner
    
    if(this.formJson.partners.length){
      this.partnerData=    this.formJson.partners;
      for(let partner of this.partnerData){
        partner['panUpload'] = false;
        partner['aadharUpload'] = false;
        partner['supportDoc'] = false;
        partner['photo'] = false;
      }
    }
    this.cdr.detectChanges();
  }

  partnerDoc(event:any,val:any,index:any){
    // console.log("fileee11111")
    if (event.target.files && event.target.files[0]) {
      // console.log("fileee")
      const file = event.target.files[0]
      const email = this.partnerData[index].email.email
      this.fileUploader.nativeElement.value = null;

      if(val == 1){
        // console.log("partner",partner)
        this.partnerData[index].panName = file.name;
      
        this.companiesService.uploadPartnerPan(file,email).then((res)=>{
          this.partnerData[index].panUpload = true;
          this.cdr.detectChanges();
          // console.log(this.partnerData[index])
           this.checkingUploads();

        },(e)=>{
           console.log("error");
        })

      }if(val == 2){
        this.partnerData[index].aadharName = file.name;
        this.companiesService.uploadPartnerAadhar(file,email).then((res)=>{
          this.partnerData[index].aadharUpload = true;
          this.cdr.detectChanges();
          this.checkingUploads();
        },(e)=>{
          console.log("error");
        })


      }if(val == 3){
          this.partnerData[index].supportDocName =file.name;
          this.companiesService.uploadPartnerSupport(file,email).then((res)=>{
            this.partnerData[index].supportDoc = true;
            this.cdr.detectChanges();
            this.checkingUploads();
          },(e)=>{
            console.log("error");
          })
      }if(val == 4){
        this.partnerData[index].photoName = file.name
        this.companiesService.uploadPartnerPhoto(file,email).then((res)=>{
          this.partnerData[index].photo = true;

          this.cdr.detectChanges();
          this.checkingUploads();
        },(e)=>{
          console.log("error");
        })
        
      }
          
      
    }
  }
  checkingUploads(){
    let isValid:any = false;
    this.uploadPartnerDoc(false);
    for(let partner of this.partnerData){
      if( partner['panUpload'] &&
      partner['aadharUpload'] &&
      partner['supportDoc'] &&
      partner['photo'] ){
        isValid = true;
        
      }else{
        isValid = false;
        break;
      }
    }

    if(isValid){
      // console.log("all documents uploadedd success")
      // this.updateParentModel({}, true);
      this.uploadPartnerDoc(true);
    }

  }

  changeTab(index:any){
    this.viewMode = index;
    this.showTab = index;
    this.fileUploader.nativeElement.value = null;

    this.cdr.detectChanges();

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
