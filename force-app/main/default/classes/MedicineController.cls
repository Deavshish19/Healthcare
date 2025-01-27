public with sharing class MedicineController {
    @AuraEnabled(cacheable=true)
    public static List<Medicine__c> getAllMedicines() {
        return [SELECT Id, Name, Medicine_Description__c, Medicine_Type__c FROM Medicine__c];
    }

    @AuraEnabled
    public static void addMedicinesToAppointment(Id idOfAppointment, List<Medicine_Line_Item__c> medicines) {
        List<Medicine_Line_Item__c> lineItems = new List<Medicine_Line_Item__c>();
        for (Medicine_Line_Item__c  med : medicines) {
            Medicine_Line_Item__c lineItem = new Medicine_Line_Item__c();
            lineItem.Appointment__c = idOfAppointment;
            lineItem.Medicine__c = med.Id;
            lineItem.Additional_Comments__c = med.Additional_Comments__c == null ? '' : med.Additional_Comments__c;
            lineItem.Number_of_Days__c = med.Number_of_Days__c == null ? 0 : med.Number_of_Days__c;
            lineItems.add(lineItem);
        }
        insert lineItems;
    }

}