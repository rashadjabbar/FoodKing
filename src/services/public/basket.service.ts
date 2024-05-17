import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ChangeOrdersStatusModel } from 'src/models/ChangeOrdersStatusModel';
import { RequestData } from 'src/models/request';
import { SaveOrder, ServiceFeeByUserAndAmount } from 'src/models/save-order';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apibasketUrl;

  getBasket(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetBasket`, );
  }

  addProductToBasket(request: {productId: number}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveBasket`, request );
  }

  removeBasketItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}DeleteProduct?id=${id}`);
  }

  getServiceFeeByAmount(request: {amount: number}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetServiceFeeByAmount`, request );
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetOrderById?orderId=${id}`, );
  }

  SaveOrder(request: SaveOrder): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveOrder`, request );
  }

  ChangeOrdersStatus(request: Partial<ChangeOrdersStatusModel>): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}ChangeStatus`, request );
  }

  getOrdersClient(request: RequestData, beginDate?: any, endDate?: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetOrdersClient?beginDate=${beginDate}&endDate=${endDate}`, request );
  }
  
  getDailyOrderProductList(userType: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetDailyOrderProductList?userType=${userType}`, null);
  }

  getDailyOrderNotes(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetDailyOrderNotes`, null);
  }

  GetServiceFeeByUserAndAmount(request: ServiceFeeByUserAndAmount): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetServiceFeeByUserAndAmount`, request );
  }

}
