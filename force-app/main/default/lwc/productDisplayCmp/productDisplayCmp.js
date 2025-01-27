import { LightningElement,wire } from 'lwc';
import getproducts from '@salesforce/apex/doctorsListController.getproducts';
export default class ProductDisplayCmp extends LightningElement {
    treatments = [];
    selectedTreatmentId;
    showModal = false;
    @wire (getproducts)
    productRecords({data,error}){
        if(data){
            this.treatments = data;
            console.log('Treatment > ', this.treatments);
            
        }
        else if(error){
            console.log('error in getting products', error);
            
        }
    }


    handleBookNow(event) {
        const treatmentId = event.target.dataset.id;
        //alert(`Booking treatment with ID: ${treatmentId}`);
        this.showModal = true;
    }

    handleCloseModal(){
        this.showModal = false;
    }
}