export interface Aggrement {
    id: string;
    aggrementTitle: string;
    customerId: string;
    aggrementType: string;
    offerId:string;
    agreedAmount: number;
    paidAmount: number;
    billings: string[];
    expirationDate: Date | null;
    isActive: boolean;


}
