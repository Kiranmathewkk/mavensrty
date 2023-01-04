import { Injectable } from "@angular/core";

@Injectable({
    'providedIn' : "root"
})
export class HelperService {

    processFormData(input:any) {
        let result = Object.assign({} , input);
    
        if(result.objectives) {
            result.objectives = result.objectives; 
        }
        if(result.industry){
            result.industry = {"id":result.industry}
        }
        if(result.proposedNameFirst) {
            result.proposedNameFirst = result.proposedNameFirst; 
        }
        if(result.proposedNameSecond) {
            result.proposedNameSecond = result.proposedNameSecond;
        }
        if(result.firstName && typeof(result.firstName) ==='string') {
            result.firstName = {"name" : result.firstName}
        }
        if( result.lastName  && typeof(result.lastName) === 'string') {
            result.lastName = {"name" : result.lastName}
        }
        // if( result.middleName &&   typeof(result.middleName) ==='string') {
            if(result.middleName != null){
                result.middleName = {"name" : result.middleName}
            }else{
                result.middleName=null
            }
            
        // }
      
        if(result.email) {
            result.email = {"email" : result.email}
        }
        if(result.registeredEmail) {
            result.registeredEmail = {"email" : result.registeredEmail}
        }
        if(result.mobile) {
            result.mobile = {"number" : result.mobile}
        }
        if(result.registeredMobile) {
            result.registeredMobile = {"number" : result.registeredMobile}
        }
        if(result.address_pin) {   result.address = {}; result.address.pin = result.address_pin; delete result.address_pin }
        if(result.address_line1) {   result.address.line1 = result.address_line1; delete result.address_line1 }
        if(result.address_line2){ result.address.line2 = result.address_line2; delete result.address_line2 }
        if(result.address_state){ result.address.state = result.address_state; delete result.address_state }
        if(result.address_country) { result.address.country = result.address_country; delete result.address_country }

        if(result.comm_address_pin) {   result.registeredAddress = {}; result.registeredAddress.pin = result.reg_address_pin; delete result.reg_address_pin }
        if(result.reg_address_line1) {   result.registeredAddress.line1 = result.reg_address_line1; delete result.reg_address_line1 }
        if(result.reg_address_line2){ result.registeredAddress.line2 = result.reg_address_line2; delete result.reg_address_line2 }
        if(result.reg_address_state){ result.registeredAddress.state = result.reg_address_state; delete result.reg_address_state }
        if(result.reg_address_country) { result.registeredAddress.country = result.reg_address_country; delete result.reg_address_country }

        if(result.comm_address_pin) {   result.communicationAddress = {}; result.communicationAddress.pin = result.comm_address_pin; delete result.comm_address_pin }
        if(result.comm_address_line1) {   result.communicationAddress.line1 = result.comm_address_line1; delete result.comm_address_line1 }
        if(result.comm_address_line2){ result.communicationAddress.line2 = result.comm_address_line2; delete result.comm_address_line2 }
        if(result.comm_address_state){ result.communicationAddress.state = result.comm_address_state; delete result.comm_address_state }
        if(result.comm_address_country) { result.communicationAddress.country = result.comm_address_country; delete result.comm_address_country }

        return result
    }
}