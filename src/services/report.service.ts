import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { RequestData } from 'src/models/request';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private http: HttpClient) { }

    reportUrl = environment.apiReportUrl;

    getClientBalance(request: RequestData): Observable<any> {
        return this.http.post<any>(`${this.reportUrl}Report/GetClientBalance`, request);
    }

    getBalanceMonitoring(request: RequestData, beginDate?: any, endDate?: any): Observable<any> {
        return this.http.post<any>(`${this.reportUrl}Report?beginDate=${beginDate}&endDate=${endDate}`, request);
    }
}
