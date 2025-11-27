export interface AggrementDto {
    customerId: string;
    aggrementTitle: string;
    aggrementType: string;
    agreedAmount: number;
    paidAmount: number;
    billings: string[];
    expirationDate: Date | null;
    isActive: boolean;


}
