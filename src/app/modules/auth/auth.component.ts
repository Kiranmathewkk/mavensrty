import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  currentUrl: any;
  isRegistration: boolean;

  constructor(private router:Router) {
    this.router.events.subscribe((res) => { 
      this.isRegistration = (this.router.url).includes('registration');
    })
  }

  ngOnInit(): void {
    document.body.classList.add('bg-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-body');
  }
}
