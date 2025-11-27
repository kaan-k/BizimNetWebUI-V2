export interface BillingDto {
    customerId: string;
    paidAmount: number;
    amount: number;
    billingDate: Date;
    dueDate: Date;
    paymentDate: Date;
    billingMethod: string;
    aggreementId: string;


}
