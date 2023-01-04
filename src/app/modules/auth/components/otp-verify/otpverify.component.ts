import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { AwsService } from '../../services/aws.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-otpverify',
  templateUrl: './otpverify.component.html',
  styleUrls: ['./otpverify.component.scss'],
})
export class OtpVerifyComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  
  otpForm: FormGroup;
  public hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  errorMessage: string;
  action: string = 'default';
  userEmail:any;
  userSignIn : any = JSON.parse(sessionStorage.getItem("signindata") || '{}');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private awsService:AwsService,
    private toastService:ToastService,

  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.awsService.hasError.subscribe((res:any)=>{
      if(res && res.message && res.message !='') {
       this.toastService.showError(res.message)
 
      }
    })
  }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params:Params)=>{
      this.userEmail = params['id'];

    });
    // get return url from route parameters or default to '/'
    // this.returnUrl =
    //   this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
     
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.otpForm.controls;
  }

  initForm() {
    this.otpForm = this.fb.group({
      emailOtp: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      mobileOtp: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.errorMessage ='';
    let root = this;
    // this.awsService.authenticateUserPool(this.f.email.value, this.f.password.value )
    // console.log(this.f);
    var data ={
      mobileOtp:this.f.mobileOtp.value,
      emailOtp:this.f.emailOtp.value

    }
    this.authService.otpVerify(data,this.userEmail).subscribe(res=>{
      // console.log("otpverification",res)

      this.awsService.authenticateUserPool(this.userSignIn?.email.email,this.userSignIn?.password );

      // this.router.navigate(['/auth/login']);

    },(e)=>{
      console.log("error")
      this.toastService.showError("Otp entered is not valid")
      this.otpForm.reset();
    })
   

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
