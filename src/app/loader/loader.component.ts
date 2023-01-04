import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { Globalervice } from '../global.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  // isLoading:boolean;
  isLoading: Subject<boolean> = this.globalService.isLoading;
  constructor(private router:Router,public globalService: Globalervice,private cdr:ChangeDetectorRef) {
    // this.router.navigateByUrl('/users');
  }

  ngOnInit(): void {
    
   
   
     
  }
}
