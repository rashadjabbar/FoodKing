import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apibasketUrl;

  getBasket(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetBasket`, );
  }

}
