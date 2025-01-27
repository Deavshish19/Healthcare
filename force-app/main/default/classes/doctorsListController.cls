public class doctorsListController {
    @AuraEnabled(cacheable = true)
    public static List<Doctor__c> getDoctors(){
        List<Doctor__c> listOfDoctors = [Select id,Name,Specialty__c,Phone_number__c,Degree__c from Doctor__c];
        return listOfDoctors;
    }
    
    @AuraEnabled(cacheable = true)
    Public Static List<Product2> getproducts(){
        List<Product2> listOfproducts = [Select Id,Name,Description,Product_Image_URL__c from Product2];
        return listOfproducts;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Medicine__c> getAllMedicines() {
        return [SELECT Id, Name, Medicine_Description__c, Medicine_Type__c FROM Medicine__c];
    }
    
    @AuraEnabled
    public static void addMedicinesToAppointment(Id appointmentId, List<Medicine__c> medicines) {
        List<Medicine_Line_Item__c> lineItems = new List<Medicine_Line_Item__c>();
        for (Medicine__c med : medicines) {
            Medicine_Line_Item__c lineItem = new Medicine_Line_Item__c();
            lineItem.Appointment__c = appointmentId;
            lineItem.Medicine__c = med.Id;
            lineItems.add(lineItem);
        }
        insert lineItems;
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Appointment__c> getAppointment(){
        List<Appointment__c> lstOfAppointment = [Select Id,Appointment_Date__c, Appointment_Status__c from Appointment__c 
                                                Where Appointment_Status__c = 'Scheduled' 
                                                Order By Appointment_Date__c Desc 
                                                LIMIT 1 
                                                ];
        
        Return lstOfAppointment;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getLeadsByProductInterest() {
        return [
                SELECT ProductInterest__c, COUNT(Id) recordCount
                FROM Lead
                WHERE ProductInterest__c != null
                GROUP BY ProductInterest__c
            ];
    }
    
}