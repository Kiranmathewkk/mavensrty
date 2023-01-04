import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastService } from 'src/app/modules/auth/services/toast.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { CompaniesService } from '../companies.service';
import { BackendCompanyService } from '../../backend-company/backendcompany.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-companies',
  templateUrl: './company-list.component.html',
})
export class CompanyListomponent implements OnInit {
  companiesList: any;
  viewMode = 'tab1';
  viewMode1 = 'tab2-tab1';
  viewMode2 = 'tab3-tab10';
  showTab = 0;
  companyStatus = {
    ADDED : "5%",
DOCUMENTS_PARTIALLY_UPLOADED : "10%",
DOCUMENTS_UPLOADED : "25%",
PAYMENT_INITIATED : "30%",
PAID : "40%",
NAME_APPLIED: "50%",
NAME_REJECTED: "40%",
NAME_RESUBMITTED: "50%",
NAME_APPROVED :"60%",
SPICE_APPLIED: "80%",
SPICE_REJECTED: "60%",
SPICE_RESUBMITTED: "80%",
SPICE_APPROVED: "90%",
INCORPORATED: "100%",
  }
  companydetails:any;
  showIframeDoc:any;
  downloadIframeDoc:any;
  constructor(private cdr: ChangeDetectorRef , 
    private router:Router,  private fb: FormBuilder , private backendcompanyService: BackendCompanyService,
    private companyService:CompaniesService , private toastService:ToastService,
    private sanitizer: DomSanitizer) {
    const loadingSubscr = this.isLoading$
    .asObservable()
    .subscribe((res) => (this.isLoading = res));
  this.unsubscribe.push(loadingSubscr);
  }
  @ViewChild('tab') private modal5Component: ModalComponent;
  modalConfig: ModalConfig = {
    modalTitle: 'Add company',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  companyForm: FormGroup;

  ngOnInit(): void {
    sessionStorage.clear();
    this.getcompanys();
    
  }


  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];


  getcompanys() {
    this.companyService.getCompanies().subscribe((res:any)=>{
      if(res && res.content){
      this.companiesList = res.content;
      this.companiesList.forEach((company: any) => {
        company.isResume = false;
        if(company?.status == 'DOCUMENTS_UPLOADED' || company?.status == 'ADDED' || company?.status == 'PAYMENT_INITIATED' || company?.status == 'DOCUMENTS_PARTIALLY_UPLOADED'){
          //console.log("yesss resume aplication")
          company.isResume = true;
        }
        // company.isResume = false;
      });

      for(let company of this.companiesList){
          if(company.status == "ADDED"){
               company['progress'] = this.companyStatus.ADDED
          } 
          if(company.status == "DOCUMENTS_PARTIALLY_UPLOADED"){
            company['progress'] = this.companyStatus.DOCUMENTS_PARTIALLY_UPLOADED
          }
          if(company.status == "DOCUMENTS_UPLOADED"){
            company['progress'] = this.companyStatus.DOCUMENTS_UPLOADED
          }
          if(company.status == "INCORPORATED"){
            company['progress'] = this.companyStatus.INCORPORATED
          }
          if(company.status == "NAME_APPLIED"){
            company['progress'] = this.companyStatus.NAME_APPLIED
          }
          if(company.status == "NAME_APPROVED"){
            company['progress'] = this.companyStatus.NAME_APPROVED
          }
          if(company.status == "NAME_REJECTED"){
            company['progress'] = this.companyStatus.NAME_REJECTED
          }
          if(company.status == "NAME_RESUBMITTED"){
            company['progress'] = this.companyStatus.NAME_RESUBMITTED
          }
          if(company.status == "PAID"){
            company['progress'] = this.companyStatus.PAID
          }
          if(company.status == "PAYMENT_INITIATED"){
            company['progress'] = this.companyStatus.PAYMENT_INITIATED
          }
          if(company.status == "SPICE_APPLIED"){
            company['progress'] = this.companyStatus.SPICE_APPLIED
          }
          if(company.status == "SPICE_APPROVED"){
            company['progress'] = this.companyStatus.SPICE_APPROVED
          }
      }

      this.cdr.detectChanges();
    }
    })
  }

  onAddCompany() {
    this.router.navigate(['/companies/form' , 'new'])
  }

  editCompany(company:any){
    //console.log(company)
    if(company.status == "DOCUMENTS_UPLOADED" || company.status == "ADDED" || company.status == "PAYMENT_INITIATED" || company.status == "DOCUMENTS_PARTIALLY_UPLOADED"  ){
      this.router.navigate(['/companies/form/',company.id]);
    }
  }
 async companyDetails(company: any) {
  // console.log(company);
  this.companydetails = {};

    this.companydetails['firstname'] = company?.proposedNameFirst;
    this.companydetails['secondname'] = company?.proposedNameSecond;
    this.companydetails['industry'] = company?.industry;
    this.companydetails['objectives'] = company?.objectives;
    this.companydetails['type'] = company?.type;
    this.companydetails['partners'] = company?.partners

    this.companydetails['nameApplicationFee'] = company?.nameApplicationFee;
    this.companydetails['dsc'] = company?.dsc;
    this.companydetails['panTanFee'] = company?.panTanFee;
    this.companydetails['stateFee'] =company?.stateFee;
    this.companydetails['professionalFee'] = company?.professionalFee;
    this.companydetails['gst'] = company?.gst;
    this.companydetails['paymentGatewayFee'] = company?.paymentGatewayFee;
    this.companydetails['paymentGatewayFeeGst'] = company?.paymentGatewayFeeGst;
    this.companydetails['orderId'] = company?.orderId;
    this.companydetails['paymentInitiatedAt'] = company?.paymentInitiatedAt;
    this.companydetails['paidAt']  = company?.paidAt;
    this.companydetails['paymentRef'] = company?.paymentRef;
    this.companydetails['paymentSignature'] = company?.paymentSignature;

   this.viewMode = 'tab1';
   this.viewMode1 = 'tab2-tab1';
   this.viewMode2 = 'tab3-tab10';
     

    this.getCompanyDoc(company);
    this.getPartnerDoc(company);
    this.modal5Component.modalConfig.modalTitle = ''
    return await this.modal5Component.open({ "modalDialogClass": "modal-lg" })

  }

  getCompanyDoc(company: any){
    this.backendcompanyService.getCompanyDocument(company.id).subscribe((res: any) => {
     // console.log("clicked", res)
      this.companydetails['res'] = res;
      this.companydetails['companyDocdown'] = res?.REGISTERED_ADDRESS_PROOF
      this.companydetails['companyDoc'] = this.sanitizer.bypassSecurityTrustResourceUrl(res?.REGISTERED_ADDRESS_PROOF)
      if(res.INCORPORATION_CERTIFICATE){
        this.companydetails['incorporatedoc'] = this.getUrl(res.INCORPORATION_CERTIFICATE);
      }
      if(res.PAN_TAN_CHALLAN){
        this.companydetails['pantandoc'] = this.getUrl(res.PAN_TAN_CHALLAN);
      }
      if(res.AOA){
        this.companydetails['aoadoc'] = this.getUrl(res.AOA);
      }
      if(res.NAME_APPROVAL_LETTER){
        this.companydetails['nameapprovaldoc'] = this.getUrl(res.NAME_APPROVAL_LETTER);
      }
      if(res.STATE_FEE_CHALLAN){
        this.companydetails['statefeedoc'] = this.getUrl(res.STATE_FEE_CHALLAN);
      }
      if(res.NAME_APPLICATION_CHALLAN){
        this.companydetails['nameapplicationdoc'] = this.getUrl(res.NAME_APPLICATION_CHALLAN);
      }
      if(res.NAME_APPLICATION_REJECTION_LETTER){
        this.companydetails['nameapplicationrejectiondoc'] = this.getUrl(res.NAME_APPLICATION_REJECTION_LETTER)
      }
      if(res.MOA){
        this.companydetails['moadoc'] = this.getUrl(res.MOA);
      }
      this.cdr.detectChanges();
    }, (e) => {
      console.log("error")
    })

  }
  getPartnerDoc(company: any){

    this.backendcompanyService.getPartnerDocument(company.id).subscribe((res: any) => {
      this.companydetails['partnersDoc'] = res
      for (let partner of this.companydetails['partnersDoc']) {
        partner["passportPhoto"] = this.getUrl(partner.documents.PASSPORT_SIZE_PHOTO);
        partner['pan'] = this.getUrl(partner.documents.PAN);
        partner['supportingDoc'] = this.getUrl(partner.documents.SUPPORTING_DOC);
        partner['aadhar'] = this.getUrl(partner.documents.AADHAAR);
        this.cdr.detectChanges();
      }
      this.showIframeDoc =  this.companydetails.partnersDoc[0].passportPhoto;
      this.downloadIframeDoc = this.companydetails.partnersDoc[0].documents.PASSPORT_SIZE_PHOTO

    }, (e) => {
      console.log("error")
    })

  }
  getUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  toggleDiv(i:number){
    this.showTab=i;

    this.cdr.detectChanges();

  }
  loadImage(index:number,select:any){
    if(select == 1){
      this.showIframeDoc =  this.companydetails.partnersDoc[index].passportPhoto;
      this.downloadIframeDoc = this.companydetails.partnersDoc[index].documents.PASSPORT_SIZE_PHOTO
      this.viewMode2 = 'tab3-tab1'+index;
    }
    if(select == 2){
      this.showIframeDoc =  this.companydetails.partnersDoc[index].pan;
      this.downloadIframeDoc = this.companydetails.partnersDoc[index].documents.PAN
      this.viewMode2 = 'tab3-tab2'+index;
    }
    if(select == 3){
      this.showIframeDoc =  this.companydetails.partnersDoc[index].supportingDoc;
      this.downloadIframeDoc = this.companydetails.partnersDoc[index].documents.SUPPORTING_DOC
      this.viewMode2 = 'tab3-tab3'+index;
    }
    if(select == 4){
      this.showIframeDoc =  this.companydetails.partnersDoc[index].aadhar;
      this.downloadIframeDoc = this.companydetails.partnersDoc[index].documents.AADHAAR
      this.viewMode2 = 'tab3-tab4'+index;
    }
   this.cdr.detectChanges();
   
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
