export interface OfferDto {
    // Backend expects PascalCase or specific names based on your error log
    offerTitle: string; 
    customerId: string;
    description?: string;
    expirationDate: Date;
    
    // Backend expects 'OfferDetails', not 'items'
    items: OfferItemDto[];    
    totalAmount: number;
    
    // New Required Fields
    Status: string;
    EmployeeId: string; 
}

export interface OfferItemDto {
    stockId: string;
    stockName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}