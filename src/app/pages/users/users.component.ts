import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastService } from 'src/app/modules/auth/services/toast.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { UsersService} from './users.service'
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  usersList: any=[];
  companiesList:any;
  constructor(private cdr: ChangeDetectorRef ,   private fb: FormBuilder , private userService:UsersService , private toastService:ToastService) {
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
    this.getUsers();
    this.initForm();
    this.getCompanies();
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
            Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
          ]),
        ],
        authority:['',
        Validators.compose([
          Validators.required,
          
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
            Validators.pattern(/^[6-9]{1}[0-9]{9}$/)
          ]),
        ]
      }
    );
  }
   // convenience getter for easy access to form fields
   get f() {
    return this.userForm.controls;
  }

  async onAddUser() {
    this.userForm.reset();
    return await this.modalComponent.open({ "modalDialogClass" : "modal-lg"}  );
  }
  
  onCancel() {

    this.userForm.reset();

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
        "authority": this.userForm.controls.authority.value,
        "password": this.userForm.controls.password.value
    }
    this.userService.addUser(formData).subscribe((res:any)=>{
      this.isLoading$.next(false);
      this.toastService.showSuccess('User added successfully');
      this.getUsers();
      this.cdr.detectChanges();
this.modalComponent.close(  );
      
    },(err:any)=>{
      this.isLoading$.next(false);
      this.toastService.showError('Failed to add user!');
     
      this.cdr.detectChanges();
      this.modalComponent.close(  );
    })
  }

  getUsers() {
    this.userService.getUsers().subscribe((res:any)=>{
      if(res && res.content){
      this.usersList = res.content;
      this.cdr.detectChanges();
    }
    })
  }

  getCompanies() {
    this.userService.getBussinesList().subscribe((res:any)=>{
      if(res && res.content){
      this.companiesList = res.content;


      this.companiesList.forEach((company:any) => {
        company.isExpanded = false;
      });
      this.cdr.detectChanges();
      
    }
    })
    
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
