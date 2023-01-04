import {  Injectable, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(    private toastrx:ToastrService) {}

  public toasts: any[] = [];
  showError(message:string) {
    this.toastrx.error(message);
  }
  
  showSuccess(message:string) {
    this.toastrx.success(message);
  }

 
}