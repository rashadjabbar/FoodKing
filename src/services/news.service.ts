import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class NewsService {

    constructor(private http: HttpClient) { }
  
    baseUrl = environment.apiNewsUrl;
  
    getNews(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/GetNews`);
    }

    GetNewsFullData(requestBody: any = {}): Observable<any> {
      // The API expects a POST with a request body containing pagination, filters and date range.
      return this.http.post<any>(`${this.baseUrl}/GetNewsFullData`, requestBody);
    }

    getNewsById(newsId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/GetNewsById?newsId=${newsId}` );
    }

    saveNews(model: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/SaveNews`, model);
    }

    changeNewsStatus(model: any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/ChangeStatus`, model);
    }

    approveNewsStatus(model: any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/AproveStatus`, model);
    }

  }
  
