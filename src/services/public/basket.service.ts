import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { SaveOrder } from 'src/models/save-order';

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

  SaveOrder(request: SaveOrder): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveOrder`, request );
  }
}
