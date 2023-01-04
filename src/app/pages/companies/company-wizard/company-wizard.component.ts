import { IfStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit, ViewChild,Input,AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HelperService } from 'src/app/helper.service';
import { ToastService } from 'src/app/modules/auth/services/toast.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { CompaniesService } from '../companies.service';
import { Company} from '../company.model';
import { environment } from "src/environments/environment";
import swal from 'sweetalert2';

declare  var Razorpay :any;

@Component({
  selector: 'app-company-wizard',
  templateUrl: './company-wizard.component.html',
})
export class CompanyWizardComponent implements OnInit,AfterContentInit {
  @Input() obj: { value: string };
  companiesList: any;
  formsCount = 5;
  guardActive:boolean = true;
  razorpayPaymentId : any;
  rasozpaySignature :any;
  razorpayOrderId :any;

  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );




  
  constructor(private cdr: ChangeDetectorRef ,   private fb: FormBuilder , private companiesService:CompaniesService , private toastService:ToastService
   , private helperService:HelperService , private router:Router,
   private route: ActivatedRoute,) {

    const loadingSubscr = this.isLoading$
    .asObservable()
    .subscribe((res) => (this.isLoading = res));
  this.unsubscribe.push(loadingSubscr);
  }
  @ViewChild('modal') private modalComponent: ModalComponent;
  modalConfig: ModalConfig = {
    modalTitle: 'Add User',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  userForm: FormGroup;
  userDetails:any;


  ngOnInit(): void {

    this.route.params.subscribe((params:Params)=>{
      if(params['id'] != 'new'){

        this.goToSnipper(params['id']);
      }

    });
    sessionStorage.clear();
    
    this.loginDetails();
    this.getCompanies();
    this.initForm();
    // this.currentStep$.next(4);
  }
    
  initForm() {
    this.userForm = this.fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
          ]),
        ],
        mobile: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
          ]),
        ]
      }
    );
  }
   // convenience getter for easy access to form fields
   get f() {
    return this.userForm.controls;
  }

  async onAddCompany() {
    this.userForm.reset();
    return await this.modalComponent.open({ "modalDialogClass" : "modal-lg"}  );
  }
  
  onCancel() {

  }
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];




  saveSettings() {
    this.isLoading$.next(true);
    let formData = {
        "firstName": {
        "name": this.userForm.controls.firstName.value
        },
        "middleName": null,
        "lastName": {
        "name":  this.userForm.controls.lastName.value
        },
        "email": {
        "email":  this.userForm.controls.email.value
        },
        "mobile": {
        "number":  this.userForm.controls.mobile.value
        },
        "authority": "BACKEND_USER",
        "password": this.userForm.controls.password.value
    }
    this.companiesService.addCompanies(formData).subscribe((res:any)=>{
      this.isLoading$.next(false);
      this.toastService.showSuccess('Company added successfully');
      this.getCompanies();
      this.cdr.detectChanges();
this.modalComponent.close(  );
      
    },(err:any)=>{
      this.isLoading$.next(false);
      this.toastService.showError('Failed to add company!');
      this.cdr.detectChanges();
      this.modalComponent.close(  );
    })
  }

  getCompanies() {
    this.companiesService.getCompanies().subscribe((res:any)=>{
      if(res && res.content){
      this.companiesList = res.content;
      this.cdr.detectChanges();
    }
    })
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  updateCompany = (part: Partial<any>, isFormValid: boolean) => {

    
    
    const currentCompany = this.companiesService.company$.value;
    // console.log("currentCompany",currentCompany)
   
    const updatedCompany = { ...currentCompany, ...part };
    this.companiesService.company$.next(updatedCompany);
    this.isCurrentFormValid$.next(isFormValid);
    // console.log(currentCompany.type,currentCompany.industry,currentCompany.objectives,currentCompany.proposedNameFirst,currentCompany.proposedNameSecond)
    if(currentCompany.type == undefined && currentCompany.industry == "" && currentCompany.objectives == "" &&
    currentCompany.proposedNameFirst =="" && currentCompany.proposedNameSecond == ""){
      this.guardActive=true;

    }else{
      this.guardActive = false;
    }
    // console.log(updatedCompany);
  };

  updatePartners = (partner: any,isFormValid: boolean,edit?:number) => {
     
    this.guardActive = false;
    const currentCompany = this.companiesService.company$.value;
    // console.log("edit index",edit)
    if(edit != undefined){
      // console.log("on edit")
      currentCompany.partners.splice(edit,1)
      currentCompany.partners.push(partner);
      this.companiesService.company$.next(currentCompany);
    }else{
      //  console.log("not edit")
      
      // console.log("partner",partner);
      // console.log("partners current company",currentCompany);
      if(Object.keys(partner).length === 0 && partner.constructor === Object){
  
      }else{
        if(currentCompany.partners){
          currentCompany.partners.push(partner)
        }else{
          currentCompany.partners =[partner];
        }
      }
      this.companiesService.company$.next(currentCompany);
    }
   
      
    
    
    
    //   if(  currentCompany.partners != undefined) {
    //     (currentCompany.partners).push(partner)
    //   }else{
    //     // if(Object.keys(partner).length){
    //     //   currentCompany.partners =[partner];
    //     // }else{
    //     //   currentCompany.partners =[];
    //     // }
  
    //     currentCompany.partners =[partner];
        
    //   }
    
    // console.log("partners current company",currentCompany);
    this.isCurrentFormValid$.next(isFormValid);
   
    // for(let partner of currentCompany.partners){
    //   if(Object.keys(partner).length == 0){
    //     currentCompany.partners.splice(partner,1)
    //   }
    // }
    sessionStorage.setItem('userDetails', JSON.stringify(this.companiesService.company$.value));
  };
  updateCompanyDoc = (part: Partial<any>, isFormValid: boolean) => {
    this.isCurrentFormValid$.next(isFormValid);
    this.cdr.detectChanges()
    //console.log("isformdata",isFormValid);
  }
  updatepartnerDoc =  (part: Partial<any>, isFormValid: boolean) => {
    this.isCurrentFormValid$.next(isFormValid);
    this.cdr.detectChanges()
  }

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep$.next(nextStep);
    
    if(nextStep ===4) {

    this.companiesService.addCompanies(this.helperService.processFormData(this.companiesService.company$.value)).subscribe(res=>{
      // console.log("response of company",res);
      // sessionStorage.removeItem('userDetails');
      const resData:any =  res;
      var obj ={
        id:resData['id']
      }
      sessionStorage.setItem('bussinessId',JSON.stringify(obj))
      this.guardActive=true;
       
      // this.router.navigate(['companies' , 'list'])
      // this.router.navigate(['/bussiness' , { queryParams: { id: resData['id'] } }])
      // this.router.navigate(['/heroes', { id:  }]);
      
    },(e)=>{
     // console.log("not contain bussiness id")
      this.currentStep$.next(3);
      this.cdr.detectChanges()
    });
    
    }
  }

  prevStep() {
    if(this.currentStep$.value != 3 && this.currentStep$.value != 4 && this.currentStep$.value != 5 ){
      const prevStep = this.currentStep$.value - 1;
      if (prevStep === 0) {
        return;
      }
      this.currentStep$.next(prevStep);
    }
    
   
  }
  loginDetails(){
    this.companiesService.loginUser().subscribe((res:any)=>{
       this.userDetails = res.entrepreneur
       this.cdr.detectChanges();
    })
  }
  ngAfterContentInit(){
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);  
  }
}


  options = {
    "key": environment.razorPayKey,     // "rzp_test_L3yVKFAoZ6XjvE", // Enter the Key ID generated from the Dashboard
    "currency": "INR",
    "name": "Incorpd",
    "description": "Company Registration",
    "image": "https://incorpd.mavenstry.io/image/incorpd-logo-no-text.png",
    "order_id": "",
    "handler": this.paymentCapture.bind(this),
    "prefill": {
        "name": "",
        "email": "",
        "contact": ""
    },
    "notes": {
        "address": "Mavenstry Private Limited"
    },
    "theme": {
        "color": "#3399cc"
    }
  };

  razorPay(){

    this.companiesService.paymentInit().subscribe((res:any)=>{

      if(res.orderId){
        this.options.order_id = res.orderId

        this.options.prefill.name = this.userDetails.fullName.name
        this.options.prefill.contact = this.userDetails.mobile.number
        this.options.prefill.email = this.userDetails.email.email
        
        var rzp1 = new Razorpay(this.options);

   
        rzp1.open();
           
        rzp1.on('payment.failed',function(response:any){
          // console.log("unsuccessfull");
          // console.log(response);
          // alert(response.error.description);
          //this.response = response
          swal.fire(
            "Payment not done", "Please try again","error"
   
           )
        })

      }

    },(e)=>{
      this.toastService.showError("Order Id not Created")

    })

  }
  paymentCapture(response:any){
    this.razorpayPaymentId = response.razorpay_payment_id;
    this.rasozpaySignature = response.razorpay_signature;
    this.razorpayOrderId  = response.razorpay_order_id;
    
    let obj ={
      razorpayOrderId: this.razorpayOrderId,
      razorpayPaymentId:this.razorpayPaymentId,
      razorpaySignature :this.rasozpaySignature
    }

   if(this.razorpayPaymentId && this.rasozpaySignature && this.razorpayOrderId){
       this.companiesService.paymentVerify(obj).subscribe(res=>{
        swal.fire({
          title:"Success",
          text:"Your Payment is successful. You will shortly get an email with the next steps and timeline for the registration process. You will also be notified vie email and whatsapp on all milestones. Congratulations on your entrepreneur journey. Sitback and relax while we complete the process for you.",
          showConfirmButton: true, 
          icon:"success"
        }
    
        ).then((result)=>{
          this.router.navigate(['companies' , 'list']);
        })

        // this.router.navigate(['companies' , 'list'])

       },(e)=>{
        console.log(e);
       })

    }
  }
  goToSnipper(id:any){
    

    this.companiesService.getSingleCompany(id).subscribe((res:any)=>{
      sessionStorage.setItem('userDetails', JSON.stringify(res));
      sessionStorage.setItem('bussinessId',JSON.stringify({id:id}))
      //console.log("bussine",res)
      if(res.status == "ADDED"){
        this.currentStep$.next(4);
      }
      if(res.status == "DOCUMENTS_UPLOADED" ){
        this.currentStep$.next(5);
      }
      if(res.status == "DOCUMENTS_PARTIALLY_UPLOADED"){
        this.currentStep$.next(4);
      }
      if(res.status == 'PAYMENT_INITIATED'){
        this.currentStep$.next(5);
      }
       

    },(e)=>{
      console.log(e)
    })
  }

}
