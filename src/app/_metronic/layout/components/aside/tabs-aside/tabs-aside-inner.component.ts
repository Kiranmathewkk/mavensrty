import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { environment } from './../../../../../../environments/environment';

import { Tab, tabs } from '../tabs';
import { NavigationEnd, Router, NavigationCancel } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  MenuComponent,
  DrawerComponent,
  ToggleComponent,
  ScrollComponent,
} from '../../../../kt/components';
@Component({
  selector: 'app-tabs-aside-inner',
  templateUrl: './tabs-aside-inner.component.html',
})
export class TabsAsideInnerComponent implements OnDestroy {
  @Input() activeTab: Tab = tabs[0];
  @ViewChild('ktTabsAsideScroll', { static: true })
  ktTabsAsideScroll: ElementRef;
  loginedUser:any= JSON.parse(localStorage.getItem('loginedUserDetails') || '{}');
  currentUserRole:any;
  nameLetter:any={};
  private unsubscribe: Subscription[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routingChanges();
    this.getCurrentUserRoleDetails();
    this.getLetters();

   
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  menuReinitialization() {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
      ToggleComponent.reinitialization();
      ScrollComponent.reinitialization();
      if (this.ktTabsAsideScroll && this.ktTabsAsideScroll.nativeElement) {
        this.ktTabsAsideScroll.nativeElement.scrollTop = 0;
      }
    }, 50);
  }
  getCurrentUserRoleDetails() {
    if(localStorage.getItem('incorpd-user-details')){
      const currentUserRoleDetails = localStorage.getItem('incorpd-user-details');
      this.currentUserRole = currentUserRoleDetails !== null ? JSON.parse(currentUserRoleDetails).userDetails[0].authority : null;
    }
  }
  getLetters(){
    if(this.currentUserRole == 'ENTREPRENEUR'){
      this.nameLetter.first = this.loginedUser.fullName.name.substring(0, this.loginedUser.fullName.name.indexOf(' ')); // "72"
   this.nameLetter.second = this.loginedUser.fullName.name.substring(this.loginedUser.fullName.name.indexOf(' ') + 1); // "tocirah sneab"

    }
    

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
