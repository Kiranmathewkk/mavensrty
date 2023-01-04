import { Injectable } from '@angular/core';
import { Router,ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleguardGuard implements CanActivate {
  currentUserRole:any;
  constructor(private router:Router){}
  canActivate(
    
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //return this.isAuthorized(route);
    if(this.isAuthorized(route)){
      return true;
    }else{
      if(this.currentUserRole == 'PLATFORM_ADMIN' || this.currentUserRole == 'BACKEND_ADMIN'){
        this.router.navigate(['backend/dashboard'])
      }else{
        this.router.navigate(['dashboard'])
      }
      
      return false;
    }
  }
  private isAuthorized(route:ActivatedRouteSnapshot):boolean{
    this.getCurrentUserRoleDetails()
    const role = [this.currentUserRole]    
    const expectedRoles = route.data.expectedRoles;
    const roleMatchs = role.findIndex(role=> expectedRoles.indexOf(role) !== -1);
    return roleMatchs<0 ? false : true;

  }
  getCurrentUserRoleDetails() {
    if(localStorage.getItem('incorpd-user-details')){
      const currentUserRoleDetails = localStorage.getItem('incorpd-user-details');
      this.currentUserRole = currentUserRoleDetails !== null ? JSON.parse(currentUserRoleDetails).userDetails[0].authority : null;
    }
  }
}
