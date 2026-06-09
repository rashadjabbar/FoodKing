export class StatusRequest {
    id?: number;
  status!: boolean;
  // optional key to indicate which boolean status to change (e.g. 'isActive' or 'isApproved')
  key?: string;
  }