import { Component, HostBinding, OnInit,Input } from '@angular/core';
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-dropdown-menu1',
  templateUrl: './dropdown-menu1.component.html',
})
export class DropdownMenu1Component implements OnInit {
  @Input() message: string;
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
   apiUrl:any;
   version:any;
   mode:any;
  constructor() {}

  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.version = environment.appVersion;
    this.mode = environment.modeOfDevelopment;
  }
}
