import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestData } from 'src/models/request';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CampaignWinnerService {
  constructor(private http: HttpClient) { }

  baseUrl = environment.apiCampaignUrl;

  getCampaignWinners(request: RequestData, beginDate?: any, endDate?: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}GetCampaignWinners?beginDate=${beginDate}&endDate=${endDate}`, request);
  }
}
