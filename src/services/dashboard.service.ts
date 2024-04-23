import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Payment } from 'src/models/payment';
import { RequestData } from 'src/models/request';

@Injectable({
    providedIn: 'root'
  })

  export class DashboardService {

    constructor(private http: HttpClient) { }
  
    baseUrl = environment.apiReportUrl;
  
    getDashboardInfoAdmin(beginDate?: any, endDate?: any): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}Report/GetDashboardInfo?beginDate=${beginDate}&endDate=${endDate}&dataType=1` );
    }
    getDashboardInfo(beginDate?: any, endDate?: any): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}Report/GetDashboardInfo?beginDate=${beginDate}&endDate=${endDate}&dataType=2` );
    }
    

  }
  