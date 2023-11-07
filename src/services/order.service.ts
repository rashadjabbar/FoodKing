import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { RequestData } from 'src/models/request';
import { SaveOrder } from 'src/models/save-order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apibasketUrl;

  getOrder(request: RequestData, beginDate?: any, endDate?: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetOrders?beginDate=${beginDate}&endDate=${endDate}`, request );
  }

  getOrderById(id: number){
    return this.http.get<any>(`${this.baseUrl}GetOrderById?orderId=${id}`);
  }

  saveOrder(request: SaveOrder): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveOrder`, request );
  }
}
