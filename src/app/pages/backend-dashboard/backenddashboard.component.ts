import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendDashboardService} from './backenddashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './backenddashboard.component.html',
  styleUrls: ['./backenddashboard.component.scss'],
})
export class BackendDashboardComponent implements OnInit {

  tileData:any;
  constructor(private router:Router, private backendDashboardService:BackendDashboardService) {
    // this.router.navigateByUrl('/users');
  }

  ngOnInit(): void {
   this.getTileData();
  
  }

  getTileData(){
    this.backendDashboardService.dashboardTileData().subscribe((res)=>{

      this.tileData = res;
    },(e)=>{
      console.log("Error")
    })
  }
}
