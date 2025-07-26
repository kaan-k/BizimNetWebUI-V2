export interface DocumentFile{
    id:string
    offerId:string 
    departmentId:string 
    documentName:string
    documentPath:string 
    createdAt:Date
    lastModifiedAt:Date
    file:File
}