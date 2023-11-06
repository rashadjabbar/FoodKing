import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { RequestData } from 'src/models/request';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  constructor(private http: HttpClient) { }

  baseUrl = environment.apiPaymentUrl;
  allCategoryUrl = environment.apiCommonUrl

  getProduct(request: RequestData, beginDate: Date, endDate: Date): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Payment/GetPayments?beginDate=${beginDate}&endDate=${endDate}`, request );
  }
}
