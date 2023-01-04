import { Injectable,ApplicationRef } from "@angular/core";
import { Subject } from 'rxjs';

function getWindow(): any {
   return window;
 }
 declare const window: any;

@Injectable({
    'providedIn' : "root"
})
export class Globalervice {
     
  //  public loading: boolean = false;
  isLoading = new Subject<boolean>();

   

  script = document.createElement('script');
  

    constructor() { }
    
       
    

    show() {
      this.isLoading.next(true);
   }
   
 
   hide() {
      this.isLoading.next(false);
   }
   load(obj?:any) {
      
      this.script.type = 'text/javascript';
      this.script.async = true;
      this.script.src = `https://ind-widget.freshworks.com/widgets/88000000580.js`;
      window.fwSettings = {
        'widget_id': 88000000580,
        'locale': 'en'
      };
  
      window.fwSettings = {
        'widget_id': 88000000580,
        'locale': 'en'
      };
      
      window.FreshworksWidget ||
        (function () {
          if ('function' != typeof window.FreshworksWidget) {
            var n:any = function (){
              n['q'].push(arguments);
            };
            (n['q'] = []), (window.FreshworksWidget = n);
          }
        })();
        this.script.onload = function (event) {
         if(!obj){
            window.FreshworksWidget;
         }else{
            window.FreshworksWidget('open', 'article', {
               id: obj // article ID
             });
             
         }
         
        }
        document.body.append(this.script);
  
    }


     FreshworksWidget(widgetId:any) {
      
      const window = getWindow();
      return window.FreshworksWidget('open', 'article', {
         id: widgetId // article ID
       });
    }
    
}