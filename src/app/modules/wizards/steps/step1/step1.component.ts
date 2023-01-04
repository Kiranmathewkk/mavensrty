import { Component, Input, OnDestroy, OnInit ,AfterViewInit,ChangeDetectorRef,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompaniesService } from 'src/app/pages/companies/companies.service';
import { ICreateAccount } from '../../create-account.helper';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { ModalComponent } from 'src/app/_metronic/partials/layout/modals/modal/modal.component';
import { Globalervice } from '../../../../global.service';


@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy ,AfterViewInit{
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  industryList: any = [
    
  ];
  objectiveList:any=[];
  private unsubscribe: Subscription[] = [];
  showDropDown:any;
  formJson:any;
  isFormData:boolean = false;
  industryValue:any;
  objectivesValues:any;
  companyOption:any;
  companyTypeSelected:any;
  checkedList : any[];
    currentSelected : {};
    showIndex:any;
  
  obj:any = sessionStorage.getItem('userDetails');
  @ViewChild('modal') private modalComponent: ModalComponent;
  modalConfig: ModalConfig = {
    modalTitle: '',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };

  constructor(private fb: FormBuilder, private companiesService: CompaniesService,
    private cdr: ChangeDetectorRef,private globalService:Globalervice ) {
    this.checkedList = [];
   }
   script = document.createElement('script');
  ngOnInit() {
    this.objectiveList=[];
   
    
    
    this.initForm();
    if(this.obj){
      this.formJson = JSON.parse(this.obj)
      this.isFormData = true
      this.valueToForm()
    }

    this.updateParentModel({}, false);
    // console.log("obj",JSON.parse(this.obj))
    
   
  }

  load(widgetId:any) {
    
    this.globalService.FreshworksWidget(widgetId);
  }
  ngAfterViewInit(){
    
  }
  valueToForm(){
    if(this.formJson.industry){
    var obj={
       target : {
        value:this.formJson.industry
       }

    }  
      this.onChangeInd(obj);
    }
    this.form.setValue({
      type:'',
      proposedNameFirst:this.formJson.proposedNameFirst,
      proposedNameSecond: this.formJson.proposedNameSecond,
      industry:this.formJson.industry,
      objectives:this.formJson.objectives
      
      
    })
   this.industryValue =   this.formJson?.industry
   this.objectivesValues = this.formJson.objectives
   this.companyOption = this.formJson.type
   if(this.companyOption == "OPC"){
    this.companyTypeSelected = "OPC PRIVATE LIMITED"
    
    }
   if(this.companyOption == "PVT_LTD"){
    this.companyTypeSelected = "PRIVATE LIMITED"
   
    }
   
  }

  initForm() { 
    this.form = this.fb.group({
      type: ['', [Validators.required]],
      proposedNameFirst: ['', [Validators.required]],
      proposedNameSecond: ["", ],
      industry: ['',[Validators.required]],
       
   
      objectives: ['', [Validators.required]],
    });
    this.getIndustryDetails();
    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      
      // console.log(val)
      if(this.form.valid == true){
        
        let name1 = val.proposedNameFirst;
        let name2 = val.proposedNameSecond;
        // if(this.companyTypeSelected == 'OPC PRIVATE LIMITED'){
        //   name1.replace('OPC PRIVATE LIMITED', '');
        //   name2.replace('OPC PRIVATE LIMITED', '');
        // }
        // if(this.companyTypeSelected == "PRIVATE LIMITED"){
        //   name1.replace('PRIVATE LIMITED', '');
        //   name2.replace('PRIVATE LIMITED', '');
        // }
        
        
        

        val.proposedNameFirst = name1+' '+this.companyTypeSelected
        if(name2 != ""){
          val.proposedNameSecond = name2+' '+this.companyTypeSelected
        }
        
        

        
      }
      
      
      // console.log("check",this.form.valid)
      this.updateParentModel(val, this.form.valid);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  getIndustryDetails() {
    this.industryList = this.companiesService.getIndustryListDetails().subscribe((res: any) => {
      if (res) {
        this.industryList = res;
        this.cdr.detectChanges();
        // console.log("response data",this.industryList);
      }
    });
  }

  onChangeInd(state: any) {
    // console.log("changee")
    //  console.log(state.target.value);
  if(state.target.value != "Select Industry..."){
    this.objectiveList = this.companiesService.getObjectivesListDetails(state.target.value).subscribe((res:any)=>{
      if(res){
        //  console.log(res);
         this.objectiveList = res;
         this.cdr.detectChanges();
         if(this.objectivesValues.length > 0){
          for(let selected of this.objectivesValues){
            for(let objective of this.objectiveList){
              if(objective.text == selected){
                objective['checked']=true;
              }
            }
          }
         }
      }
    })

  }
    
  }
  setCompanyType(){
    let type = this.form.value.type
    // console.log(type)
    
      if(this.form.value.type == "OPC"){
        this.companyTypeSelected = "OPC PRIVATE LIMITED"
        let name1 = this.form.get('proposedNameFirst')!.value 
        let modi = name1.replace('OPC PRIVATE LIMITED', '')
        // console.log("modified",modi)
        this.form.controls['proposedNameFirst'].setValue(modi);
      }
      if(this.form.value.type == "PVT_LTD"){
        this.companyTypeSelected = "PRIVATE LIMITED"
        let name2 = this.form.get('proposedNameFirst')!.value 
        let modi = name2.replace('PRIVATE LIMITED', '')
        this.form.controls['proposedNameFirst'].setValue(modi);
      }
      
     this.cdr.detectChanges();
   
    
    // console.log(this.form.value.proposedNameFirst)
    // this.form.get('proposedNameFirst').value;
    
  }
  setCompanyType2(){
    
      if(this.form.value.type == "OPC"){
        this.companyTypeSelected = "OPC PRIVATE LIMITED"
        let name1 = this.form.get('proposedNameSecond')!.value
         let modi = name1.replace('OPC PRIVATE LIMITED', '');
        this.form.controls['proposedNameSecond'].setValue(modi);
      }
      if(this.form.value.type == "PVT_LTD"){
        this.companyTypeSelected = "PRIVATE LIMITED"
        let name2 = this.form.get('proposedNameSecond')!.value
        let modi = name2.replace('PRIVATE LIMITED', '');
        this.form.controls['proposedNameSecond'].setValue(modi);
      }
      this.cdr.detectChanges();

    
  }
  companyType(){
    // console.log("company type")
    // if(this.form.value.proposedNameFirst ){
    //   this.form.controls['proposedNameFirst'].setValue("");
    // }if(this.form.value.proposedNameSecond){
    //   this.form.controls['proposedNameSecond'].setValue("");
    // }
    

    if(this.form.value.type == "OPC"){
      this.companyTypeSelected = "OPC PRIVATE LIMITED"
      
    }
    if(this.form.value.type == "PVT_LTD"){
      this.companyTypeSelected = "PRIVATE LIMITED"
     
    }
    this.cdr.detectChanges();
    
    
  }

  getSelectedValue(status:Boolean,value:String){
    if(status){
      this.checkedList.push(value);  
      this.form.controls['objectives'].setValue(this.checkedList);
    }else{
        var index = this.checkedList.indexOf(value);
        this.checkedList.splice(index,1);
        this.form.controls['objectives'].setValue(this.checkedList);
    }
    
    this.currentSelected = {checked : status,name:value};

    //share checked list
    
    
    //share individual selected item
    
}
async showMore(text:any){
  this.showIndex=text;
  return await this.modalComponent.open({ "modalDialogClass" : "modal-lg"}  );
  
}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}


// this.form.controls['address_country'].setValue("INDIA");