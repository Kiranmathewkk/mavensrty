import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import * as $ from 'jquery';


@Injectable({
    'providedIn' : "root"
})

export class BackendDashboardService {

    constructor(private http:HttpClient) {

    }
   dashboardTileData(){
      return this.http.get(environment.apiUrl+'dashboard/backend')
   }
       
}