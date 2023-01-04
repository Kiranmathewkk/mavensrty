import { Component,OnInit,OnDestroy,Input ,ChangeDetectorRef,HostListener,AfterContentInit} from '@angular/core';
import { CompaniesService } from '../../../../pages/companies/companies.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Globalervice } from '../../../../global.service';


declare  var Razorpay :any;

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
})
export class Step5Component implements OnInit,AfterContentInit {

  
  
  paymentSummary:any;
  razorpayPaymentId:any;
  razorpayOrderId:any;
  rasozpaySignature:any;
  userDetails:any;
  partnerList:any=[];
  obj:any = JSON.parse(sessionStorage.getItem('userDetails') || '');
  

  constructor(private companiesService:CompaniesService,private cdr: ChangeDetectorRef,
    private router:Router,private globalService:Globalervice) {}
    ngOnInit(){
    this.loginDetails();
    this.getPaymentSummary();

    this.partnerList = this.obj.partners;
    
  }

  ngAfterContentInit(){
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);  
  }

  }

  load(widgetId:any) {
    
    this.globalService.FreshworksWidget(widgetId);
  }
  
  loginDetails(){
    this.companiesService.loginUser().subscribe((res:any)=>{
       this.userDetails = res.entrepreneur
       this.cdr.detectChanges();
    })
  }
  

  getPaymentSummary(){
    this.companiesService.getPaymentSummary().subscribe((res)=>{
      this.paymentSummary = res
      this.cdr.detectChanges();
      // console.log(this.paymentSummary);
    },(e)=>{
      console.log(e);
    })
  }


  paymentCapture(response:any){

    this.razorpayPaymentId = response.razorpay_payment_id;
    this.rasozpaySignature = response.razorpay_signature;
    this.razorpayOrderId  = response.razorpay_order_id;

    // console.log("payment_id",this.razorpayPaymentId,this.rasozpaySignature,this.razorpayOrderId );

    swal.fire({
      title:"Success",
      text:"Your Payment is successful. You will shortly get an email with the next steps and timeline for the registration process. You will also be notified vie email and whatsapp on all milestones. Congratulations on your entrepreneur journey. Sitback and relax while we complete the process for you.",
      showConfirmButton: true, 
      icon:"success"
    }

    ).then((result)=>{
      this.router.navigate(['companies' , 'list']);
    })

    /*if(this.razorpayPaymentId && this.rasozpaySignature && this.razorpayOrderId){
       this.companiesService.paymentVerify().subscribe(res=>{
        console.log("response after verification",res)
        this.router.navigate(['companies' , 'list'])

       },(e)=>{
        console.log(e);
       })

    }*/

  }



  /*@HostListener('window:payment.success',['$event'])
  onPaymentSuccess(event:any): void{
    console.log("success",event.detail);
    // console.log("success",event)
    
    this.cdr.detectChanges();
  }*/
}
