import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { AwsService } from './aws.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private AwsService: AwsService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.AwsService.isLoggedIn();
    if (currentUser) {

      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.AwsService.onLogout();
    return false;
  }
}
