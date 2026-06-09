export interface SaveNewsDto {
  Id: number;
  Text: string;
  Link: string | null;
}

export interface NewsFilter {
  columnName: string;
  value: string;
  order?: number;
}

export interface NewsRequestPayload {
  nextPageNumber: number;
  visibleItemCount: number;
  filters: NewsFilter[];
  beginDate: string | null;
  endDate: string | null;
}

export interface NewsRawItem {
  Id?: number;
  id?: number;
  Text?: string;
  text?: string;
  Link?: string | null;
  link?: string | null;
  ApprovalStatus?: boolean | number;
  approvalStatus?: boolean | number;
  Status?: boolean | number;
  status?: boolean | number;
  CreateDate?: string;
  createDate?: string;
  createdAt?: string;
  date?: string;
  [key: string]: any;
}

export interface NewsItem {
  Id?: number;
  Text?: string | null;
  Link?: string | null;
  ApprovalStatus?: boolean | number;
  Status?: boolean | number;
  CreateDate?: string | null;
  [key: string]: any;
}

export interface NewsResponse {
  result?: NewsRawItem[];
  count?: number;
  data?: any;
}
