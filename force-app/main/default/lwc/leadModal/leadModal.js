import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { LightningElement,track, wire } from 'lwc';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import PRODUCT_INTEREST_FIELD from '@salesforce/schema/Lead.ProductInterest__c';
export default class LeadModal extends LightningElement {

    @track productoptions = [ 
        { label: 'Hair Transplant', value: 'Hair Transplant' },
        { label: 'Dental Implant', value: 'Dental Implant' },
        { label: 'Eye Surgery', value: 'Eye Surgery' },
        { label: 'Chemotherapy', value: 'Chemotherapy' },
        { label: 'Orthopedic Surgery', value: 'Orthopedic Surgery' },
        { label: 'Cardiac Treatments', value: 'Cardiac Treatments' },
        { label: 'Neurological Treatments', value: 'Neurological Treatments' }
    ];

    @track salutationOptions = [
        { label: '--None--', value: '' },
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' },
        { label: 'Mx.', value: 'Mx.' }
    ];

    @track productInterestOptions = [];

    @wire (getObjectInfo,{objectApiName : LEAD_OBJECT})
    wiredLeadObject;

    @wire (getPicklistValues,{recordTypeId: "$wiredLeadObject.data.defaultRecordTypeId", fieldApiName: PRODUCT_INTEREST_FIELD })
    wiredPicklistValues({data,error}){
        if(data){
            console.log('Inside wire ', data.values);
            this.productInterestOptions = data.values;   
            //console.log('Inside wire ', this.productInterestOptions);
                     
        }
        else if(error){
            console.log('Error');
            
        }
    }

    closeModal(){
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleSubmit(){
        this.closeModal();
    }
}