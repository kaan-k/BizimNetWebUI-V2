export interface Duty {
    id:string
    name:string
    description:string
    customerId:string
    priority:string
    status:string
    lastUpdated:Date
    deadline:Date
    createdAt:Date
    beginsAt:Date
    endsAt:Date
    completedAt:Date
    createdBy:string
    completedBy:string
    assignedEmployeeId: string;
    assignedToName?: string;
  startUtc: string;  // e.g. "2025-08-27T09:00:00Z"
  endUtc: string;    // e.g. "2025-08-27T11:00:00Z"
  signatureBase64?: string
}