import { LightningElement, api } from 'lwc';
import addMedicinesToAppointment from '@salesforce/apex/MedicineController.addMedicinesToAppointment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { CloseActionScreenEvent } from 'lightning/actions';

const columns = [
    { label: 'Medicine Name', fieldName: 'Name', type: 'text' },
    { label: 'Number of Days', fieldName: 'Number_of_Days__c', type: 'number', editable: true },
    { label: 'Comment', fieldName: 'Additional_Comments__c', type: 'text', editable: true }
];

export default class MedicineDosage extends LightningElement {
    @api selectedMedicines = [];
    @api appointmentId;
    //draftValues =[];
    columns = columns;
    saveDraftValues = [];
    listOfMedicines = [];

    handleBack() {
        const backEvent = new CustomEvent('back');
        this.dispatchEvent(backEvent);
    }

    handleSave(event) {

        this.saveDraftValues = event.detail.draftValues;
        this.listOfMedicines = this.selectedMedicines.map((medicine, index) => {
            const draft = this.saveDraftValues.find((d) => d.id === `row-${index}`);
            return {
                Id: medicine.Id,
                Number_of_Days__c: draft?.Number_of_Days__c || null,
                Additional_Comments__c: draft?.Additional_Comments__c || null
            };
        });
        this.listOfMedicines = JSON.parse(JSON.stringify(this.listOfMedicines));
        //console.log('listOfMedicines >', this.listOfMedicines);
        this.template.querySelector('lightning-datatable').draftValues = [];
    }

    handleAddMedicines() {
        if (this.listOfMedicines.length > 0) {
            addMedicinesToAppointment({
                idOfAppointment: this.appointmentId,
                medicines: this.listOfMedicines

            })
                .then(() => {

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Medicines added successfully!',
                            variant: 'success'
                        })
                    );
                    const cancelEvent = new CustomEvent('cancel');
                    this.dispatchEvent(cancelEvent);
                    console.log('after dispatch');
                    
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'No Medicines Selected',
                    message: 'Please select at least one medicine.',
                    variant: 'warning'
                })
            );
        }
    }
}
