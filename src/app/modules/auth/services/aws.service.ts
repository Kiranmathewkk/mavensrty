import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { environment } from "src/environments/environment";
import { LoginComponent } from "../components/login/login.component";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable(
    {  providedIn: 'root'}
)
export class AwsService {
    cognitoUser: AWSCognito.CognitoUser;
    userPool: AWSCognito.CognitoUserPool;
    hasError=  new BehaviorSubject({});
    verificationCodeSent=  new BehaviorSubject(false);
    userRole: any;
    constructor(private httpClient: HttpClient, private router: Router ,     private route: ActivatedRoute,) {
    }
    token: any;
    sessionUserAttributes: any;
    poolData = {
        // Incorpd Cognito Params
        ClientId: environment.AWS.ClientId ,//CognitoUserPool,
        UserPoolId: environment.AWS.UserPoolId // CognitoUserPoolClient
    };

    /*
        createCognitoIUser()
      */
    createCognitoIUser(username:string): void {
        this.userPool = new AWSCognito.CognitoUserPool(this.poolData);
        this.cognitoUser = new AWSCognito.CognitoUser({
            Username: username,
            Pool: this.userPool
        });
    }
    console() {

    }
    chnagePassword( oldPassword:string, newPassword:string) {
        var root = this;
        this.cognitoUser.changePassword(oldPassword, newPassword,
            function(err, data ) {
                if (err) console.log(err, err.stack); // an error occurred
                else   {
                    // Password changed successfully' Show Notifications
                      
                }        // successful response
            });

    }

    /*
         authenticateUserPool() : Cognito Authenticate : onLoginSucess
      */
    authenticateUserPool(username: string, password: any ) {
        let root = this;
        this.createCognitoIUser(username);

        const authDetails = new AWSCognito.AuthenticationDetails({
            Username: username,
            Password: password
        });
        // console.log("authentication",authDetails);
        return this.cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {

                
                // Get & Store jwt token from idTkoen
                this.setToken(result.getIdToken().getJwtToken());
                this.setRefreshToken(result.getRefreshToken().getToken());
                this.onLoginSucess();
            },
            onFailure: (err: any) => {
                this.hasError.next({'message' : err.message})
                //Show notifications
            },
            newPasswordRequired: function (userAttributes: { email_verified: any;  email:any}, requiredAttributes: any) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.
                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                delete userAttributes.email;
                // store userAttributes on global variable
                root.sessionUserAttributes = userAttributes;
                root.redirectToConfirmPassword();
            }
        });
    }

    /*
        onLoginSucess() :  Gets logged in user details;
      */
    onLoginSucess() {
       
            this.httpClient
                .get(environment.apiUrl + 'me')
                .subscribe((response) => {
                    let resp: any = response;
                    if (resp && resp.authentication) {
                        this.setUserLoggedIn(true);
                        this.setUserRole(resp.authentication.authorities);
                        this.setUserDetails(resp.authentication.authorities);
                        if(this.userRole == 'PLATFORM_ADMIN' || this.userRole == 'BACKEND_ADMIN'){
                            this.setLoginedUserDetails(resp.backendUser)
                            this.router.navigateByUrl('backend/dashboard');
                        }
                        if(this.userRole == 'ENTREPRENEUR'){
                            this.setLoginedUserDetails(resp.entrepreneur)
                            this.router.navigateByUrl('/dashboard');
                        }
                        
                         //todo
                    }
                
                });

    }
    setLoginedUserDetails(detail:any){

           localStorage.setItem('loginedUserDetails',JSON.stringify(detail));
    }
    
    setUserRole(authorities: { authority: any; }[]) {
        if(authorities && authorities[0] && authorities[0].authority) {
                this.userRole = authorities[0].authority;
        }
    }

    setUserDetails(role: any) {
            localStorage.setItem('incorpd-user-details', JSON.stringify({ 'userDetails': role }));
    }

    /*
        setUserLoggedIn() :  set user loggedIn status;
      */
    setUserLoggedIn(value: boolean) {
        localStorage.setItem(
            'Incorpd-loggedIn',
            JSON.stringify({
                value: value
            })
        );
    }

    /*
        isLoggedIn() :  returns user loggedIn status;
      */
    isLoggedIn() {
        let isLoggedIn:any = localStorage.getItem('Incorpd-loggedIn');
        if (JSON.parse(isLoggedIn) && JSON.parse(isLoggedIn).value) {
            return true;
        } else {
            return false;
        }
    }

    /*
      onLogout() :  Clears data & logout.
      */
    onLogout() {
        // this._notificationService.closeEventSource();

        localStorage.removeItem('Incorpd-loggedIn');
        localStorage.removeItem('Incorpd-token');
        localStorage.clear();
        this.setUserLoggedIn(false);
        this.router.navigate(['/auth/login']);
    }

    /*
      redirectToConfirmPassword() : redirect to confirm password
      */
    redirectToConfirmPassword() {
        this.router.navigateByUrl('/auth/confirm-password');
    }

    /*
      handleNewPassword() : submit new credentials from confirm password
      */
    handleNewPassword(newPassword: any ,) {
        let root = this
        if (this.cognitoUser) {
            this.cognitoUser.completeNewPasswordChallenge(
                newPassword,
                this.sessionUserAttributes, 
                {
                    onSuccess(session, userConfirmationNecessary?) {
                        // console.log('session'  ,session);
                        // console.log('userConfirmationNecessary'  ,userConfirmationNecessary);
                        
                        root.setToken(session.getIdToken().getJwtToken());
                        root.onLoginSucess();   
                    },
                    onFailure: (err) => {
                        console.log("Error on password reset" , err)
                        // Show notification
                    }
                }
            );
        } else {
            this.router.navigateByUrl('/auth/login');
        }
    }

    /*
      setToken() :  Saves token recieved in local storage
      */

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('Incorpd-token', token);
    }

    setRefreshToken(token: any) {
        this.token = token;
        localStorage.setItem('Incorpd-refresh-token', JSON.stringify({ "token": token, 'setTime': new Date() }));
    }

    forgotPassword(username:string) {
this.createCognitoIUser(username);
        let root = this;
        // call forgotPassword on cognitoUser
        return new Promise((resolve,reject)=>{ 
            this.cognitoUser.forgotPassword({
            onSuccess: function(result) {
            },
            onFailure: function(err) {
                reject(err);
            },
            inputVerificationCode(res) { // this is optional, and likely won't be implemented as in AWS's example (i.e, prompt to get info)
                resolve(res);
            }
        });
        })
    }
    resetPassword(username:string, verificationCode:string, newPassword:string) {
        let root=this;
            this.cognitoUser.confirmPassword(verificationCode, newPassword, {
                onFailure(err) {
                },
                onSuccess(res) {
                    root.router.navigateByUrl('/auth/login');
                },
            });
    }
}
