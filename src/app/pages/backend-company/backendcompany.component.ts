import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastService } from 'src/app/modules/auth/services/toast.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { BackendCompanyService } from './backendcompany.service'
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-backendcompany',
  templateUrl: './backendcompany.component.html',
})
export class BackendCompanyComponent implements OnInit {
  usersList: any;
  companiesList: any;
  selectedId: any;
  disableButton: any;
  viewMode = 'tab1';
  viewMode1 = 'tab2-tab1';
  viewMode2 = 'tab3-tab10';
  page: number = 0;
  count: number ;
  tableSize: number = 10;
  companyOption: any;
  companydetails: any;
  isShow: boolean = false;
  actionsIconOrder: number;
  selectedCompanyDetails:any;
  showTab = 0;
  showIframeDoc:any;
  downloadIframeDoc:any;
  companyStatus = {
    ADDED: "5%",
    DOCUMENTS_PARTIALLY_UPLOADED: "10%",
    DOCUMENTS_UPLOADED: "25%",
    PAYMENT_INITIATED: "30%",
    PAID: "40%",
    NAME_APPLIED: "50%",
    NAME_REJECTED: "40%",
    NAME_RESUBMITTED: "50%",
    NAME_APPROVED: "60%",
    SPICE_APPLIED: "80%",
    SPICE_REJECTED: "60%",
    SPICE_RESUBMITTED: "80%",
    SPICE_APPROVED: "90%",
    INCORPORATED: "100%",
  }
  searchOn: any = {
    status: 1,
    type: 1
  };
  uploadStatus:any={
    nameapplied:false,
    nameaprove:false,
    namereject:false,
    nameresubmit:false,
    pantan:false,
    statefee:false,
    moa:false,
    aoa:false,
    incorporate:false,
    spicerejection:false
    
  }
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private backendcompanyService: BackendCompanyService,
    private toastService: ToastService,
    private sanitizer: DomSanitizer) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }
  @ViewChild('modal') private modalComponent: ModalComponent;

  modalConfig: ModalConfig = {
    modalTitle: 'Applied Name',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal2') private modal2Component: ModalComponent;
  @ViewChild('modal3') private modal3Component: ModalComponent;
  @ViewChild('modal4') private modal4Component: ModalComponent;
  @ViewChild('tab') private modal5Component: ModalComponent;
  @ViewChild('modal6') private modal6Component: ModalComponent;


  userForm: FormGroup;
  aproveForm: FormGroup;

  ngOnInit(): void {
    this.getUsers();
    this.initForm();
    this.getCompanies();
    this.aprovalForm();
  }

  initForm() {
    this.userForm = this.fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
          ]),
        ],
        mobile: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
          ]),
        ]
      }
    );
  }

  aprovalForm(){
    this.aproveForm = this.fb.group(
      {
        aprovedName : ['',Validators.compose([Validators.required])],
      
        pan: ['',Validators.compose([Validators.required])],
        tan:['',Validators.compose([Validators.required])],

        cin: ['',Validators.compose([Validators.required])],
        date:['',Validators.compose([Validators.required])]
      },
      
     
    )
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }
  get aF() {
    return this.aproveForm.controls;
  }

  async onAddUser() {
    this.userForm.reset();
    return await this.modalComponent.open({ "modalDialogClass": "modal-lg" });
  }

  onCancel() {

  }
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];




  saveSettings() {
    this.isLoading$.next(true);
    let formData = {
      "firstName": {
        "name": this.userForm.controls.firstName.value
      },
      "middleName": null,
      "lastName": {
        "name": this.userForm.controls.lastName.value
      },
      "email": {
        "email": this.userForm.controls.email.value
      },
      "mobile": {
        "number": this.userForm.controls.mobile.value
      },
      "authority": "BACKEND_USER",
      "password": this.userForm.controls.password.value
    }
    this.backendcompanyService.addUser(formData).subscribe((res: any) => {
      this.isLoading$.next(false);
      this.toastService.showSuccess('User added successfully');
      this.getUsers();
      this.cdr.detectChanges();
      this.modalComponent.close();

    }, (err: any) => {
      this.isLoading$.next(false);
      this.toastService.showError('Failed to add user!');

      this.cdr.detectChanges();
      this.modalComponent.close();
    })
  }

  getUsers() {
    this.backendcompanyService.getUsers().subscribe((res: any) => {
      if (res && res.content) {
        this.usersList = res.content;
        this.cdr.detectChanges();
      }
    })
  }

  getCompanies() {
    this.disableButton = {
      nameApplied: true,
      nameApproved: true,
      nameRejected: true,
      nameResubmitted: true,
      spiceApplied: true,
      spiceApproved: true,
      spiceRejected: true,
      spiceResubmitted: true
    }
    //  this.disableButton['paid'] = true;
    //  this.disableButton['applied'] = false;
    //  this.disableButton['resubmit'] = false;
    //  this.disableButton['resubmited'] = false;
    //  this.disableButton['aproved'] = false;
    //  this.disableButton['spiceapplied'] = false;
    //  this.disableButton['spicereject'] = false;
    //  this.disableButton['spiceresubmit'] = false;
    //  this.cdr.detectChanges();
    this.backendcompanyService.getBussinesList(this.page).subscribe((res: any) => {
      if (res && res.content) {
        this.companiesList = res.content;
        this.count = res.totalElements

        for (let company of this.companiesList) {
          if (company.status == "ADDED") {
            company['progress'] = this.companyStatus.ADDED
          }
          if (company.status == "DOCUMENTS_PARTIALLY_UPLOADED") {
            company['progress'] = this.companyStatus.DOCUMENTS_PARTIALLY_UPLOADED
          }
          if (company.status == "DOCUMENTS_UPLOADED") {
            company['progress'] = this.companyStatus.DOCUMENTS_UPLOADED
          }
          if (company.status == "INCORPORATED") {
            company['progress'] = this.companyStatus.INCORPORATED
          }
          if (company.status == "NAME_APPLIED") {
            company['progress'] = this.companyStatus.NAME_APPLIED
          }
          if (company.status == "NAME_APPROVED") {
            company['progress'] = this.companyStatus.NAME_APPROVED
          }
          if (company.status == "NAME_REJECTED") {
            company['progress'] = this.companyStatus.NAME_REJECTED
          }
          if (company.status == "NAME_RESUBMITTED") {
            company['progress'] = this.companyStatus.NAME_RESUBMITTED
          }
          if (company.status == "PAID") {
            company['progress'] = this.companyStatus.PAID
          }
          if (company.status == "PAYMENT_INITIATED") {
            company['progress'] = this.companyStatus.PAYMENT_INITIATED
          }
          if (company.status == "SPICE_APPLIED") {
            company['progress'] = this.companyStatus.SPICE_APPLIED
          }
          if (company.status == "SPICE_APPROVED") {
            company['progress'] = this.companyStatus.SPICE_APPROVED
          }
        }


        this.companiesList.forEach((company: any) => {
          company.isExpanded = false;
        });
        this.cdr.detectChanges();

      }
    })

  }
  async appliedName() {
    this.modalComponent.modalConfig.modalTitle = "Name Applied"
    return await this.modalComponent.open({ "modalDialogClass": "modal-lg" });
  }
  async resubmited() {
    this.modal2Component.modalConfig.modalTitle = "Name Resubmitted"
    return await this.modal2Component.open({ "modalDialogClass": "modal-lg" })
  }
  async spiceapplied() {
    this.modal3Component.modalConfig.modalTitle = "Spice Applied"
    return await this.modal3Component.open({ "modalDialogClass": "modal-lg" })
  }
  async spiceresubmit() {
    this.modal4Component.modalConfig.modalTitle = "Spice Resubmitted"
    return await this.modal4Component.open({ "modalDialogClass": "modal-lg" })

  }
  async companyDetails(company: any) {

    this.companydetails = {};

    this.companydetails['firstname'] = company?.proposedNameFirst;
    this.companydetails['secondname'] = company?.proposedNameSecond;
    this.companydetails['industry'] = company?.industry?.name;
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

    



    this.cdr.detectChanges();
    this.getCompanyDoc(company);
    this.getPartnerDoc(company);



    this.modal5Component.modalConfig.modalTitle = ''
    return await this.modal5Component.open({ "modalDialogClass": "modal-lg" })

  }
  getCompanyDoc(company: any) {
    // console.log(company.id)
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
  getPartnerDoc(company: any) {
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

  selectedCompany(company: any) {
    this.uploadStatus={};
    this.disableButton['nameApplied'] = true;
    this.disableButton['nameApproved'] = true;
    this.disableButton['nameRejected'] = true;
    this.disableButton['nameResubmitted'] = true;
    this.disableButton['spiceApplied'] = true;
    this.disableButton['spiceApproved'] = true;
    this.disableButton['spiceRejected'] = true;
    this.disableButton['spiceResubmitted'] = true;
    this.selectedId = company.id;
    this.selectedCompanyDetails = company;

    if (company.status == "PAID") {
      this.disableButton['nameApplied'] = false;
    }

    if (company.status == "NAME_APPLIED") {
      this.disableButton['nameApproved'] = false;
      this.disableButton['nameRejected'] = false;
    }

    if (company.status == "NAME_APPROVED") {
      this.disableButton['spiceApplied'] = false;
    }

    if (company.status == "NAME_REJECTED") {
      this.disableButton['nameResubmitted'] = false;
    }

    if (company.status == "NAME_RESUBMITTED") {
      this.disableButton['nameApproved'] = false;
      this.disableButton['nameRejected'] = false;
    }

    if (company.status == "SPICE_APPLIED") {
      this.disableButton['spiceApproved'] = false;
      this.disableButton['spiceRejected'] = false;
    }

    if (company.status == "SPICE_REJECTED") {
      this.disableButton['spiceResubmitted'] = false;
    }

    if (company.status == "SPICE_RESUBMITTED") {
      this.disableButton['spiceApproved'] = false;
      this.disableButton['spiceRejected'] = false;
    }

    this.cdr.detectChanges();
  }
  async sendActions(val: any) {
    this.actionsIconOrder = val;
   if(this.actionsIconOrder == 10){
    this.modal6Component.modalConfig.modalTitle = "";
    return await this.modal6Component.open({ "modalDialogClass": "modal-lg" })

   }else{
    if(this.actionsIconOrder == 2){
     
      
      this.aproveForm.controls['pan'].disable();
      this.aproveForm.controls['tan'].disable();
      this.aproveForm.controls['cin'].disable();
      this.aproveForm.controls['date'].disable();

    }
    if(this.actionsIconOrder == 8){
      this.aproveForm.controls['aprovedName'].disable();
      this.aproveForm.controls['pan'].enable();
      this.aproveForm.controls['tan'].enable();
      this.aproveForm.controls['cin'].enable();
      this.aproveForm.controls['date'].enable();

     
    }
    this.modal6Component.modalConfig.modalTitle = "Upload";
    return await this.modal6Component.open({ "modalDialogClass": "modal-lg" })
   }
    

  }

  onTableDataChange(event: any) {
    // console.log("event", event)
    this.page = event-1;
    this.selectedId = '';
    this.getCompanies()
  }
  download(url: any) {
    // let url1="https://incorpd-uploaded-documents.s3.ap-south-1.amazonaws.com/3d22c6d6-e016-4ce0-9d46-c6cc8dfb2412/93f1cbf5-a61c-42ff-b943-5967447c195d-321392e62e2b4747a12988cb0cf38828-abilify_2mg_5mg.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20221124T154017Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIATEQM2J6LKPSXIGQM%2F20221124%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=4a94c6b77e0f64dbb992e0dd7d92575f3cb551c645eb561f9cd7383d71aea2eb"
    this.backendcompanyService.downloadDoc(url).then((res) => {
      let filename = "Company_address.png"
      let blob: Blob = res.body as Blob
      let a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.click()
    }

    )
  }
  searchCompany() {
    // console.log("clicked", this.searchOn)
    let searchData = []
    if (this.searchOn.proposedfirst) {
      searchData.push({
        "field": "proposedNameFirst",
        "query": this.searchOn.proposedfirst,
        "type": "String",

      })
    }
    if (this.searchOn.proposedsecond) {
      searchData.push({
        "field": "proposedNameSecond",
        "query": this.searchOn.proposedsecond,
        "type": "String",

      })
    }
    if (this.searchOn.cin) {
      searchData.push({
        "field": "cin",
        "query": this.searchOn.cin,
        "type": "String",

      })
    }
    if (this.searchOn.pan) {
      let pattern = (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      var re = new RegExp(pattern)
      if (!re.test(this.searchOn.pan)) {

          this.toastService.showError("Enter valid PAN")
         return false;
      } 

      searchData.push({
        "field": "pan",
        "query": this.searchOn.pan,
        "type": "String",

      })
    }
    if (this.searchOn.tan) {
      searchData.push({
        "field": "tan",
        "query": this.searchOn.tan,
        "type": "String",

      })
    }
    if (this.searchOn.gst) {
      searchData.push({
        "field": "gstin",
        "query": this.searchOn.gst,
        "type": "String",

      })
    }
    if (this.searchOn.aprovedname) {
      searchData.push({
        "field": "approvedName",
        "query": this.searchOn.aprovedname,
        "type": "String",

      })
    }
    if (this.searchOn.email) {
      let pattern =  (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      var re = new RegExp(pattern);
      if(!re.test(this.searchOn.email)){
        this.toastService.showError("Enter valid Email")
        return false
      }
      searchData.push({
        "field": "registeredEmail",
        "query": this.searchOn.aprovedname,
        "type": "Email",

      })
    }
    if (this.searchOn.mobile) {
      let pattern =  (/^[6-9]{1}[0-9]{9}$/)
      var re  = new RegExp(pattern)
      if(! re.test(this.searchOn.mobile)){
        this.toastService.showError("Enter Valid Mobile Number")
        return false;
      }
      searchData.push({
        "field": "registeredMobile",
        "query": this.searchOn.mobile,
        "type": "PhoneNumber",

      })
    }
    if (this.searchOn.status && this.searchOn.status != 1) {

      searchData.push({
        "field": "status",
        "query": this.searchOn.status,
        "type": "Business.Status",

      })
    }
    if (this.searchOn.type && this.searchOn.type != 1) {
      searchData.push({
        "field": "type",
        "query": this.searchOn.type,
        "type": "Business.Type",

      })
    }

    // console.log("searchdata", searchData)
    if (searchData.length) {
      this.backendcompanyService.searchCompany(searchData).subscribe((res: any) => {
        // console.log(res)
        if (res && res.content) {
          this.companiesList = res.content;

          for (let company of this.companiesList) {
            if (company.status == "ADDED") {
              company['progress'] = this.companyStatus.ADDED
            }
            if (company.status == "DOCUMENTS_PARTIALLY_UPLOADED") {
              company['progress'] = this.companyStatus.DOCUMENTS_PARTIALLY_UPLOADED
            }
            if (company.status == "DOCUMENTS_UPLOADED") {
              company['progress'] = this.companyStatus.DOCUMENTS_UPLOADED
            }
            if (company.status == "INCORPORATED") {
              company['progress'] = this.companyStatus.INCORPORATED
            }
            if (company.status == "NAME_APPLIED") {
              company['progress'] = this.companyStatus.NAME_APPLIED
            }
            if (company.status == "NAME_APPROVED") {
              company['progress'] = this.companyStatus.NAME_APPROVED
            }
            if (company.status == "NAME_REJECTED") {
              company['progress'] = this.companyStatus.NAME_REJECTED
            }
            if (company.status == "NAME_RESUBMITTED") {
              company['progress'] = this.companyStatus.NAME_RESUBMITTED
            }
            if (company.status == "PAID") {
              company['progress'] = this.companyStatus.PAID
            }
            if (company.status == "PAYMENT_INITIATED") {
              company['progress'] = this.companyStatus.PAYMENT_INITIATED
            }
            if (company.status == "SPICE_APPLIED") {
              company['progress'] = this.companyStatus.SPICE_APPLIED
            }
            if (company.status == "SPICE_APPROVED") {
              company['progress'] = this.companyStatus.SPICE_APPROVED
            }
          }

          searchData = [];
          this.searchOn = {
            status: 1,
            type: 1
          };
          this.companiesList.forEach((company: any) => {
            company.isExpanded = false;
          });
          this.cdr.detectChanges();
        }

      }, (e) => {
        this.toastService.showError(e.status)
        searchData = [];
          this.searchOn = {
            status: 1,
            type: 1
          };
        console.log("eroror")
      })
    }



  }
  clearCompany() {
    this.getCompanies();
  }
  closeModel() {
    this.modal6Component.close();
  }
  iconActon() {
    if (this.actionsIconOrder == 1) {

      

      this.backendcompanyService.paid(this.selectedId).subscribe((res: any) => {
        this.toastService.showSuccess("Name Applied")
        
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
             company.status = "NAME_APPLIED"
             this.disableButton['nameApplied'] = true;
             this.disableButton['nameApproved'] = false;
            this.disableButton['nameRejected'] = false;
            
          }
        }
        this.cdr.detectChanges();
        this.modal6Component.close();

      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 2) {

     
    //  let dateFormate = this.aproveForm.get('date')!.value;
    //  let date  = new Date(dateFormate.year,dateFormate.month,dateFormate.day)
    //  this.aproveForm.controls['date'].setValue(date);
     let obj ={
      aprovedName: this.aproveForm.get('aprovedName')!.value
     }
     
    //  console.log(obj)
      this.backendcompanyService.nameAppliedAprove(this.selectedId,obj).subscribe((res) => {
        this.toastService.showSuccess("Name Aproved")
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
              company.status = "NAME_APPROVED"
              this.disableButton['nameApproved'] =true;
                this.disableButton['nameRejected'] = true;
                this.disableButton['spiceApplied'] = false;
    
          }
        }
        this.cdr.detectChanges();
        this.modal6Component.close();
        this.clearAndReset();

      }, (e) => {
        console.log("error");
      })
    }
    if (this.actionsIconOrder == 3) {

      

      // company.status == "NAME_REJECTED"
      this.backendcompanyService.nameAppliedReject(this.selectedId).subscribe((res) => {
        this.toastService.showSuccess("Name Rejected")
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
                company.status = "NAME_REJECTED"
               
              this.disableButton['nameApproved'] =true;
                this.disableButton['nameRejected'] = true;
                
                this.disableButton['nameResubmitted'] = false;
    
          }
        }
        this.modal6Component.close();
        this.clearAndReset();

      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 4) {


      

      this.backendcompanyService.nameResubmit(this.selectedId).subscribe((res) => {
        this.toastService.showSuccess("Name Resubmited")
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
            company.status = "NAME_RESUBMITTED";
            this.disableButton['nameApproved'] = false;
            this.disableButton['nameRejected'] = false;
            this.disableButton['nameResubmitted'] = true;
          }
        }
        this.modal6Component.close();
        this.clearAndReset();

      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 5) {
      this.backendcompanyService.nameAppliedAprove(this.selectedId,"ass").subscribe((res) => {
        this.toastService.showSuccess("Name Resubmited Aproved")
        this.modal6Component.close();

      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 6) {
      this.backendcompanyService.nameAppliedReject(this.selectedId).subscribe((res) => {
        this.toastService.showSuccess("Name Resubmited Rejected")
        this.modal6Component.close();


      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 7) {

      
      this.backendcompanyService.spiceApplied(this.selectedId).subscribe((res) => {
        this.toastService.showSuccess("Spice Applied")
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
            company.status = "SPICE_APPLIED"
            this.disableButton['spiceApproved'] = false;
            this.disableButton['spiceRejected'] = false;
            this.disableButton['spiceApplied'] = true;
          }
        }
        this.modal6Component.close();
        this.clearAndReset();


      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 8) {
      let dateFormate = this.aproveForm.get('date')!.value;
     let date  = new Date(dateFormate.year,dateFormate.month,dateFormate.day)
     this.aproveForm.controls['date'].setValue(date);
    
     let obj ={
      pan:this.aproveForm.get('pan')!.value,
      tan:this.aproveForm.get('tan')!.value,
      cin:this.aproveForm.get('cin')!.value,
      date: date
       }
       
      this.backendcompanyService.spiceAppliedAprove(this.selectedId,obj).subscribe((res) => {
        this.toastService.showSuccess("Spice Applied Aproved")
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
            company.status = "SPICE_APPROVED"
            this.disableButton['spiceApproved'] = true;
            this.disableButton['spiceRejected'] = true;
            this.disableButton['spiceApplied'] = true;
          }
        }
  
      
       
       this.modal6Component.close();
       this.clearAndReset();

      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 9) {

      
      this.backendcompanyService.spiceAppliedReject(this.selectedId).subscribe((res) => {
        this.toastService.showSuccess("Spice Applied Rejected")
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
            company.status = "SPICE_REJECTED";
            this.disableButton['spiceApproved'] = true;
            this.disableButton['spiceRejected'] = true;
            this.disableButton['spiceResubmitted'] = false;
          }
        }
        this.modal6Component.close();
  
        this.clearAndReset();
      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 10) {

      
      this.backendcompanyService.spiceResubmit(this.selectedId).subscribe((res) => {
        this.toastService.showSuccess("Spice Resubmited")
        for (let company of this.companiesList) {
          if (company.id == this.selectedId) {
            company.status = "SPICE_RESUBMITTED";
            this.disableButton['spiceApproved'] = false;
            this.disableButton['spiceRejected'] = false;
            this.disableButton['spiceResubmitted'] = true;
          }
        }
        this.modal6Component.close();
        this.clearAndReset();

      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 11) {
      this.backendcompanyService.spiceAppliedAprove(this.selectedId,"").subscribe((res) => {
        this.toastService.showSuccess("Spice Resubmited Aprove")
        this.modal6Component.close();

      }, (e) => {
        console.log("error")
      })
    }
    if (this.actionsIconOrder == 12) {
      this.backendcompanyService.spiceAppliedReject(this.selectedId).subscribe((res) => {
        this.toastService.showSuccess("Spice Resubmited Rejected")
        this.modal6Component.close();

      }, (e) => {
        console.log("error")
      })
    }
  }
  callInit(id: any) {
    this.backendcompanyService.callInitiat(id).subscribe((res) => {
      this.toastService.showSuccess("Call Initiated")
    }, (e) => {
      console.log("error")
      this.toastService.showError("Call Not Initiated")
    })
  }
  tradeMarkCheck(id: any) {
    this.backendcompanyService.tradeMarkCheck(id).subscribe((res) => {

    }, (e) => {
      console.log("error")
    })

  }
  fileUpload(event:any,val:any){

    if(event && event.target.files[0]){
      let file = event.target.files[0]

      this.uploadStatus['nameappliedFile']= file.name;
     



    this.backendcompanyService.uploadFiles(file,val,this.selectedId).then((res:any)=>{
      if(this.actionsIconOrder == 1){
        this.uploadStatus['nameapplied'] = true;
        // this.uploadStatus['nameappliedFile']= file.name;
      }
      if(this.actionsIconOrder == 2){
        this.uploadStatus['nameaprove'] = true;
      }
      if(this.actionsIconOrder == 3){
        this.uploadStatus['namereject']= true;
      }
      if(this.actionsIconOrder == 4){
        this.uploadStatus['nameresubmit'] = true;
      }
      if(this.actionsIconOrder == 7){
        if(val == 'PAN_TAN_CHALLAN'){
          this.uploadStatus['pantan']= true;
          this.uploadStatus['pantanFile']= file.name;
        }
       if(val == 'STATE_FEE_CHALLAN'){
        this.uploadStatus['statefee'] = true;
        this.uploadStatus['statefeeFile']= file.name;
       }
        
      }
      if(this.actionsIconOrder == 8){
        if(val == 'MOA'){
          this.uploadStatus['moa'] = true;
          this.uploadStatus['moaFile']= file.name;
        }
        if(val == 'AOA'){
          this.uploadStatus['aoa'] = true;
          this.uploadStatus['aoaFile']= file.name;
        }
        if(val == 'INCORPORATION_CERTIFICATE'){
          this.uploadStatus['incorporate'] = true;
          this.uploadStatus['incorporateFile']= file.name;
        }
        
        
      }
      if(this.actionsIconOrder == 9){
        this.uploadStatus['spicerejection'] = true;
      }
      this.toastService.showSuccess("Uploaded Success")
      this.cdr.detectChanges();

    },(e)=>{

    })

    }
    
    
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
  clearAndReset(){
    this.aproveForm.reset();

  }
  toggleDiv(i:number){
    this.showTab=i;
    this.cdr.detectChanges();

  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
