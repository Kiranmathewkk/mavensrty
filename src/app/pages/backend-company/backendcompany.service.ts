import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import * as $ from 'jquery';


@Injectable({
    'providedIn' : "root"
})

export class BackendCompanyService {

    constructor(private http:HttpClient) {

    }

    addUser(formData:any) {
       return this.http.post(environment.apiUrl + 'users/backend' , formData);
    }

    getUsers() {
        return this.http.get(environment.apiUrl + 'users/backend');
     }
     getBussinesList(page:any) {
        return this.http.get(environment.apiUrl+'backend/businesses?sort=created&page='+page+'&size=10,ASC');
     }
     getCompanyDocument(businessID:any){
      return this.http.get(environment.apiUrl+'business/'+businessID+'/documents')
     }
     getPartnerDocument(businessID:any){
      
      return this.http.get(environment.apiUrl+'business/'+businessID+'/partner/documents')
     }

     downloadDoc(url:any) {
      

      return $.ajax({
          url: url,
          type: 'GET',
          dataType:'blob',
          crossDomain:false,
          
          headers:{
            "Access-Control-Allow-Origin":"*",
            "Accept":"*"
          },
          xhr:function(){// Seems like the only way to get access to the xhr object
            var xhr = new XMLHttpRequest();
            xhr.responseType= 'blob'
            return xhr;
        },
          success: (data): any => {
            //   console.log("image upload", data)
          },
          error: (e): any => {
            //   console.log("upload error", e)
          },
         
          cache: false,
          contentType: false,
          processData: false

      });




    
     }
     searchCompany(data:any){
      return this.http.put(environment.apiUrl+'businesses/search?sort=created,ASC',data)
     }
     paid(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/name/applied',{})
     }
     nameAppliedAprove(id:any,body:any){
       return this.http.put(environment.apiUrl+'business/'+id+'/name/approved',body)
     }
     nameAppliedReject(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/name/rejected',{})
     }
     nameResubmit(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/name/resubmitted',{})
     }
     spiceApplied(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/spice/applied',{})
     }
     spiceAppliedAprove(id:any,body:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/spice/approved',body)
     }
     spiceAppliedReject(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/spice/rejected',{})
     }
     spiceResubmit(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/spice/resubmitted',{})
     }
     callInitiat(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/call/init',{})
     }
     tradeMarkCheck(id:any){
      return this.http.put(environment.apiUrl+'business/'+id+'/name/trademark/check',{})
     }
     uploadFiles(fileData:any,value:any,id:any){

      
        const url = environment.apiUrl +  'business/'+id+"/document?type="+value
        const token: any = localStorage.getItem('Incorpd-token');
        
        // return this.http.post(url, formData);
        const formdata: FormData = new FormData();
        formdata.append("file", fileData);

        return $.ajax({
            url: url,
            type: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            },
            success: (data): any => {
                // console.log("image upload", data)
            },
            error: (e): any => {
                console.log("upload error", e)
            },
            data: formdata,
            cache: false,
            contentType: false,
            processData: false

        });

     }
}