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
  
    getContactUs(request: RequestData, type?: number): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/GetDataBrowseData?type=${type}`, request );
    }

    readContactUs(contactUsId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/ChangeStatus?contactUsId=${contactUsId}`);
    }

  }
  