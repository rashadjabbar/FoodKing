import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Product } from 'src/models/product';
import { RequestData } from 'src/models/request';

@Injectable({
  providedIn: 'root'
})

export class ContactUsService {

    constructor(private http: HttpClient) { }
  
    baseUrl = environment.apiContactUsUrl;
  
    getContactUs(request: RequestData, beginDate?: any, endDate?: any, type?: number): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/Getdata?beginDate=${beginDate}&endDate=${endDate}&type=${type}`, request );
    }
  
    getPaymentByid(id: number){
      return this.http.get<any>(`${this.baseUrl}Payment/GetPaymentById/${id}`);
    }
  
    savePayment(payment: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}Payment/SavePayment`, payment);
    }
  }
  