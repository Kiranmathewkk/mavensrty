import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
    'providedIn' : "root"
})

export class UsersService {

    constructor(private http:HttpClient) {

    }

    addUser(formData:any) {
       return this.http.post(environment.apiUrl + 'users/backend' , formData);
    }

    getUsers() {
        return this.http.get(environment.apiUrl + 'users/backend');
     }
     getBussinesList() {
        return this.http.get(environment.apiUrl+'backend/businesses?sort=created,ASC');
     }
}