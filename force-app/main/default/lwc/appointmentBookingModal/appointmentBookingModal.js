import { LightningElement,api,wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import CONTACT_FIELD from '@salesforce/schema/User.ContactId';

export default class AppointmentBookingModal extends LightningElement {
    @api doctorId;
    userId = Id;
    contactId;

    @wire(getRecord, { recordId: Id, fields: [CONTACT_FIELD] })
    wiredUser({ error, data }) {
        if (data) {
            this.contactId = data.fields.ContactId.value;
            console.log('contactId>> ', this.contactId);
            console.log('userId>> ', this.userId);
            console.log('Id>> ', Id);
        } else if (error) {
            console.error('Error fetching contact:', error);
        }
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('close'));
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Appointment created successfully!',
                variant: 'success'
            })
        );
    }
}