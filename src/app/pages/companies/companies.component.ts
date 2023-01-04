import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastService } from 'src/app/modules/auth/services/toast.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { CompaniesService} from './companies.service'
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
})
export class CompaniesComponent implements OnInit {
  companiesList: any;
  constructor(private cdr: ChangeDetectorRef ,   private fb: FormBuilder , private companiesService:CompaniesService , private toastService:ToastService) {
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

  ngOnInit(): void {
    this.getCompanies();
    this.initForm();
    // console.log("data loaded");
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
      this.toastService.showSuccess('User added successfully');
      this.getCompanies();
      this.cdr.detectChanges();
     this.modalComponent.close(  );
      
    },(err:any)=>{
      this.isLoading$.next(false);
      this.toastService.showError('Failed to add user!');
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
  formsCount = 5;
  account$: BehaviorSubject<any> =
    new BehaviorSubject<any>({});
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );


  updateAccount = (part: Partial<any>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep$.next(nextStep);
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

}
