import { Injectable ,ViewChild} from "@angular/core";
import { ActivatedRouteSnapshot,CanDeactivate,RouterStateSnapshot,UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { CompanyWizardComponent } from './pages/companies/company-wizard/company-wizard.component';
import swal from 'sweetalert2';


@Injectable({
    providedIn:'root'
})

export class FormGuard implements CanDeactivate<CompanyWizardComponent>{
    constructor(){}
    canDeactivate(component: CompanyWizardComponent, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot):Observable<boolean | UrlTree> | Promise<boolean | UrlTree>| boolean | UrlTree {

           
            
               
                   
                
                return component.guardActive ? true :
                swal.fire({
                    title:"Are you sure",
                    text:"Your data will lost when redirect ",
                    showConfirmButton: true, 
                    icon:"warning",
                    confirmButtonText:"Yes",
                    showDenyButton:true,
                    denyButtonText:"Cancel"
                    
                  }
              
                  ).then((result)=>{
                    
                    return result?.value;
                  });
                
                

            }
        
        
    }
