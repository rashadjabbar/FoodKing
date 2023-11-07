import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Payment } from 'src/models/payment';
import { RequestData } from 'src/models/request';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  constructor(private http: HttpClient) { }

  baseUrl = environment.apiPaymentUrl;

  getpayment(request: RequestData, beginDate?: any, endDate?: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Payment/GetPayments?beginDate=${beginDate}&endDate=${endDate}`, request );
  }

  getPaymentByid(id: number){
    return this.http.get<any>(`${this.baseUrl}Payment/GetPaymentById/${id}`);
  }

  savePayment(payment: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Payment/SavePayment`, payment);
  }
}
