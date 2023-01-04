import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpHeaders,
    
} from '@angular/common/http';

import { Observable, throwError,finalize } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AwsService } from './modules/auth/services/aws.service'
import {  Globalervice } from './global.service';


@Injectable() export class HttpConfigInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    constructor(private AwsService: AwsService,) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: any = localStorage.getItem('Incorpd-token');
    //    this.globalService.setLoading(true);
        
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
           
        }
        if (!request.headers.has('Content-Type') && !request.url.includes('images')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        } else {
            request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data; boundary=285692534486108183339456') });
            // request = request.clone({ headers: request.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
            request = request.clone({ headers: request.headers.set('Accept', '*/*') });

        }

        // Remove projections from request
        if (request.body !== null) {
            const reqBody = JSON.stringify(request.body);
            const tempReq = reqBody.split('{?projection}');
            const processedReqBody = tempReq.join('');
            request = request.clone({ body: JSON.parse(processedReqBody) });
        }
        request = request.clone({ url: (request.url).replace('{?projection}', '') });
       
        
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                this.totalRequests--;
                
                if (event instanceof HttpResponse) {
                    
                    
                }
                if (event.type !== 0) {
                   
                    
                }
               
                return event;
            }), catchError((error: HttpErrorResponse) => {
                let data: any = {};
                data = {
                    reason: error && error.error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                if (error.status === 401 || error.status === 403 || error.status === 0) {
                    
                    this.AwsService.onLogout();
                    // console.log("interceptor")
                }
                
                return throwError(error);
            }));
    }
}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor( 
    private loadingService: Globalervice
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log('caught')
    this.totalRequests++;
    this.loadingService.show();
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        // console.log("total request",this.totalRequests)
        if (this.totalRequests == 0) {
            this.loadingService.hide()
        }
      })
    );
  }
}
