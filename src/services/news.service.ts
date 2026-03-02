import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Product } from 'src/models/product';
import { RequestData } from 'src/models/request';

@Injectable({
  providedIn: 'root'
})

export class NewsService {

    constructor(private http: HttpClient) { }
  
    baseUrl = environment.apiNewsUrl;
  
    getNews(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/GetNews`);
    }

    getContactUsById(contactUsId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/GetContactUsById?contactUsId=${contactUsId}` );
    }

    readContactUs(contactUsId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/ChangeStatus?contactUsId=${contactUsId}`);
    }

  }
  