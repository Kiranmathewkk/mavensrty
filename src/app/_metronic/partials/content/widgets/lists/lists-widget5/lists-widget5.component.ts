import { Component,OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/pages/companies/companies.service';

@Component({
  selector: 'app-lists-widget5',
  templateUrl: './lists-widget5.component.html',
})
export class ListsWidget5Component implements OnInit {
  dueDates:any;
  constructor(private companiesService:CompaniesService) {}
  ngOnInit() {
    this.duedateData();
  }

  duedateData(){
    this.companiesService.dueDateData().subscribe((res)=>{

      this.dueDates = res;
      // console.log("duedate",res)
    },(e)=>{
      console.log(e)
    })
  }
}
