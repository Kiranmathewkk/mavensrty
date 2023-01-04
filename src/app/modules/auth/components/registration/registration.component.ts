import { Component, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { UsersService } from 'src/app/pages/users/users.service';
import { ToastService } from '../../services/toast.service';
import { environment } from "src/environments/environment";
// import { ReCaptchaV3Service } from 'ng-recaptcha';



declare var grecaptcha: any;
const siteKey = 'YOUR_SITE_KEY';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  isAgree:boolean = false;

  

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService:UsersService,
    private toastService: ToastService,
    private cdr : ChangeDetectorRef
    // private recaptchaV3Service:ReCaptchaV3Service
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }


  initForm() {
    this.registrationForm = this.fb.group(
      {
        fullName: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        mobile: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[6-9]{1}[0-9]{9}$/)
          ]),
        ],
   
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
           
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)  ///^(?:(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit() {
    this.hasError = false;
    let result =  this.registrationForm.value;
    let formData:any = {
      "fullName": {
      "name": result.fullName
      },
   
      "email": {
      "email": result.email
      },
      "mobile": {
      "number": result.mobile
      },
      "password": result.password
      }
      // console.log("sign upppp",this.registrationForm.value);
      // console.log("sign upppp",formData);
      // this.recaptchaV3Service.execute('importantAction')
      // .subscribe((token: string) => {
      //   console.debug(`Token [${token}] generated`);
      // });
      
      // grecaptcha.ready(()=>{
      //   grecaptcha.execute(environment.recaptcha.siteKey, {action: 'submit'}).then((token:any) => {
      //      console.log("token",token)
      //      formData['captchaResponse']=token;
      //      const registrationSubscr = this.authService.onSignUp(formData).pipe(first())
      //      .subscribe((res:any)=>{
      //       if (res && res.id) {
      //         this.toastService.showSuccess('Sign-up successfull');
      //         this.router.navigate(['/auth/otpverify',result.email]);
      //       }else{
      //         this.hasError = true;
      //       }

      //      },err=>{
      //       this.toastService.showError('Sign-up failed! Try again later');
      //       console.log("Sign Up Error" , err);
      //      })
      //      this.unsubscribe.push(registrationSubscr);
      //     //  this.router.navigate(['/auth/otpverify',{ queryParams: {id:result.email}}]);
      //   })
      // })
    const registrationSubscr = this.authService.onSignUp(formData)
      .pipe(first())
      .subscribe((res: any) => {
        if (res && res.id) {
          sessionStorage.setItem('signindata',JSON.stringify(formData));
          this.toastService.showSuccess('Registered successfull');
          // this.router.navigate(['/auth/login']);
          this.router.navigate(['/auth/otpverify',result.email]);
        } else {
          this.hasError = true;
        }
      },err=>{
        this.toastService.showError('Sign-up failed! Try again kater');
        // console.log("Sign Up Error" , err);
      });
    this.unsubscribe.push(registrationSubscr);
  }
  agreeTerms(event:any){
    
     this.isAgree=event.target.checked;
     this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
