import { LightningElement, wire, track } from 'lwc';
import getAppointment from '@salesforce/apex/doctorsListController.getAppointment';
import STATUS_FIELD from '@salesforce/schema/Appointment__c.Appointment_Status__c';
import ID_FIELD from '@salesforce/schema/Appointment__c.Id';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class RecentAppointment extends LightningElement {

    @track appointmentId;
    formMode = 'readonly';

    @wire (getAppointment)
    wiredRecord({data,error}){
        if(data){
            this.appointmentId = data[0].Id; 
            //console.log('data', data);
            //console.log('recordId ', this.appointmentId);
                        
        }
        else if(error){
            console.log('Error getting record', error);
            
        }
    }

    handleCancel(){
        
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.appointmentId;
        fields[STATUS_FIELD.fieldApiName] = 'Canceled';

        const recordInput = { fields };
        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Success",
                message: "Appointment Canceled Successfully",
                variant: "success",
              }),
            );
            // Display fresh data in the form
            //return refreshApex(this.contact);
          })
          .catch((error) => {
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Error creating record",
                message: error.body.message,
                variant: "error",
              }),
            );
          });
    }

    handleReschedule(){
        this.formMode = 'edit';
    }
}