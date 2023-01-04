import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import * as $ from 'jquery';


@Injectable({
    'providedIn': "root"
})

export class CompaniesService {
    company$: BehaviorSubject<any> =
        new BehaviorSubject<any>({});

    

    constructor(private http: HttpClient) {

    }

    addCompanies(formData: any) {
        return this.http.post(environment.apiUrl + 'businesses', formData);
    }

    getCompanies() {
        return this.http.get(environment.apiUrl + 'businesses?sort=created,ASC');
    }

    getIndustryListDetails() {
        return this.http.get(environment.apiUrl + 'industries?sort=name,ASC');
    }

    getObjectivesListDetails(industryId?: any) {
        const url = environment.apiUrl + 'objectives?sort=text,ASC&industry=' + industryId;
        return this.http.get(url);
    }
    uploadCompanyAddressDoc(fileData: File) {
        const token: any = localStorage.getItem('Incorpd-token');
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;
        const url = environment.apiUrl + 'business/' + bussId.id + '/document/address/proof'
        
        const formdata: FormData = new FormData();
        formdata.append("file", fileData);

        return $.ajax({
            url: url,
            type: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            },
            success: (data): any => {
                //console.log("image upload", data)
            },
            error: (e): any => {
                console.log("upload error", e)
            },
            data: formdata,
            cache: false,
            contentType: false,
            processData: false

        });




        //   const formdata: FormData = new FormData();
        //   formdata.append("file", fileData);

        // //   console.log("formdata",formdata);
        //     console.log("formdata1",fileData);
        //     const url = environment.apiUrl+ 'business/'+businessId+'/document/address/proof'
        //     return this.http.put(url,formdata,httpOptions);
    }
    uploadCompanyNocDoc(fileData: File) {
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;
        const url = environment.apiUrl + 'business/' + bussId.id + '/document/address/noc'
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
    uploadPartnerPan(fileData:File,emailId:any){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;
        const url = environment.apiUrl + 'business/'+bussId.id+'/document/partner/pan?email='+emailId
        const token: any = localStorage.getItem('Incorpd-token');
        const formdata: FormData = new FormData();
        formdata.append("file", fileData);

        return $.ajax({
            url: url,
            type: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            },
            success: (data): any => {
                //console.log("image upload", data)
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
    uploadPartnerAadhar(fileData:File,emailId:any){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;

        const url = environment.apiUrl + 'business/'+bussId.id+'/document/partner/aadhar?email='+emailId
        const token: any = localStorage.getItem('Incorpd-token');
        const formdata: FormData = new FormData();
        formdata.append("file", fileData);

        return $.ajax({
            url: url,
            type: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            },
            success: (data): any => {
                //console.log("image upload", data)
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
    uploadPartnerSupport(fileData:File,emailId:any){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;

        const url = environment.apiUrl + 'business/'+bussId.id+'/document/partner/supportingDoc?email='+emailId
        const token: any = localStorage.getItem('Incorpd-token');
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

    uploadPartnerPhoto(fileData:File,emailId:any){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;  // business/{id}/document/partner/photo

        const url = environment.apiUrl + 'business/'+bussId.id+'/document/partner/photo?email='+emailId
        const token: any = localStorage.getItem('Incorpd-token');
        const formdata: FormData = new FormData();
        formdata.append("file", fileData);

        return $.ajax({
            url: url,
            type: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            },
            success: (data): any => {
                //console.log("image upload", data)
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


    getStateList() {
        return this.http.get(environment.apiUrl + 'states');
    }
    getPaymentSummary(){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;

        return this.http.get(environment.apiUrl+'business/'+bussId.id+'/payment/summary')
    }
    paymentVerify(data:any){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;

        return this.http.put(environment.apiUrl+'business/'+bussId.id+'/payment/verify',data)
    }

    loginUser(){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId: any= JSON.parse(getBusinessId ) ;

        return this.http.get(environment.apiUrl+'me')
    }
    dueDateData(){
        return this.http.get(environment.apiUrl+'dueDates')
    }
    paymentInit(){
        const getBusinessId : any = sessionStorage.getItem('bussinessId');
        const bussId:any = JSON.parse(getBusinessId);
        return this.http.put(environment.apiUrl+'business/'+bussId.id+'/payment/init',{})
    }

    getSingleCompany(bussId:any){
        return this.http.get(environment.apiUrl+'business/'+bussId);

    }


}