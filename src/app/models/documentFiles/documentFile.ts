export interface DocumentFile{
    id:string
    offerId:string
    personeId:string
    departmentId:string
    downloaderIds:string[]
    documentName:string
    documentPath:string
    documentFullName:string
    createdAt:Date
    lastModifiedAt:Date
    file:File
}