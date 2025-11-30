export interface Customer {
    id:string
    parentCustomerId:string
    isHeadquarters:boolean
    branchName:string
    name:string
    companyName:string
    email:string
    phoneNumber:string
    address:string
    city:string
    country:string
    taxId:string
    customerField:string
    status:string
    lastActionDate:Date
    lastAction:string
    createdAt:Date
    updatedAt:Date
}

