import { LightningElement, api, track, wire } from 'lwc';
import getAllMedicines from '@salesforce/apex/MedicineController.getAllMedicines';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class ScreenAction extends LightningElement {

    @api recordId; 
    @track medicineList = [];
    @track filteredMedicines = [];
    selectedMedicines = [];

    showNextStep=false;

    // Define columns for the data table
    columns = [
        { label: 'Medicine Name', fieldName: 'Name' },
        { label: 'Type', fieldName: 'Medicine_Type__c' },
        { label: 'Description', fieldName: 'Medicine_Description__c', type: 'Text' }
    ];

    // Fetch medicines when the component loads
    @wire(getAllMedicines)
    wiredMedicines({ error, data }) {
        if (data) {
            this.medicineList = data;
            this.filteredMedicines = data;
        } else if (error) {
            console.error('Error fetching medicines:', error);
        }
    }

    // Search Filter
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        this.filteredMedicines = this.medicineList.filter(med => 
            med.Name.toLowerCase().includes(searchTerm)
        );
    }

    // Row Selection Handler
    handleRowSelection(event) {
        this.selectedMedicines = event.detail.selectedRows;
    }

    

    
    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
        console.log('after cancel');
        
    }

    handleNext(){
        this.showNextStep = true;
    }

    handleBack(){
        this.showNextStep = false;       
    }
}
