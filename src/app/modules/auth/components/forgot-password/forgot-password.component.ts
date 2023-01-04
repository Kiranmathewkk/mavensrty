import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { AwsService } from '../../services/aws.service';
import { ToastService } from '../../services/toast.service';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  codeSent: boolean =false;
  confirmPasswordForm: FormGroup;
  hasError: boolean;
  userName: string;
  constructor(private fb: FormBuilder, private authService: AuthService , private awsService:AwsService , 
    private changeDetection :ChangeDetectorRef , private toastService:ToastService) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });

    this.confirmPasswordForm = this.fb.group({
   
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      code: ['',
        Validators.compose([
          Validators.required
        ]),
      ],
      confirmPassword: [
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
    this.errorState = ErrorStates.NotSubmitted;
    this.userName = this.f.email.value;
    
    this.awsService.forgotPassword(this.f.email.value).then(res=>{
      this.codeSent = true;
      this.changeDetection.detectChanges();
    },err=>{
      console.log("Error on verification code sending" , err)
      this.toastService.showError(err.message
      );
    })
  }

  confirmPassword() {
    this.hasError = false;
    if (this.confirmPasswordForm.value.password !== '' && this.confirmPasswordForm.value.confirmPassword != '' ) {
        if((this.confirmPasswordForm.value.confirmPassword ===this.confirmPasswordForm.value.password )) {
          this.awsService.resetPassword( this.userName , this.confirmPasswordForm.value.code , this.confirmPasswordForm.value.password);
        }else{
          this.hasError=true;

        }
    }else{
    }
  }
}
