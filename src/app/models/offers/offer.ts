export interface Offer {
    id:string
    customerId: string;
    employeeId: string;
    offerTitle: string;
    offerDetails: string;
    rejectionReason: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}