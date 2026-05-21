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

  completeCampaignGift(model: { id: number; status: boolean }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}CompleteCampaignGift`, model);
  }
}
