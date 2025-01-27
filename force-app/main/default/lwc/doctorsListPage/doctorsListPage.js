import { LightningElement,track, wire } from 'lwc';
import getDoctors from '@salesforce/apex/doctorsListController.getDoctors';

export default class DoctorsListPage extends LightningElement {
    @track doctors = [];
    selectedDoctorId;
    showAppointmentForm = false;

    @wire (getDoctors)
    doctorsRecord({data,error}){
        if(data){
            this.doctors = data;
            console.log('doctors > ', this.doctors);
            console.log('data > ', data);
            
        }
        else if(error){
            console.log('Error retrieving Doctor Records',error);
        }
    }

    handleBookNow(event) {
        this.selectedDoctorId = event.target.dataset.id;
        console.log('doctorId>>> ', this.selectedDoctorId);
        
        this.showAppointmentForm = true;
    }

    handleCloseModal() {
        this.showAppointmentForm = false;
    }
}