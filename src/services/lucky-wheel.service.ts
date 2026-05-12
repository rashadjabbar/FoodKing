import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environments';
import { LuckyWheelEligibility, LuckyWheelPrize, SaveUserPrizeRequest } from 'src/models/lucky-wheel';

@Injectable({
  providedIn: 'root'
})
export class LuckyWheelService {
  constructor(private http: HttpClient) { }

  baseUrl = environment.apiCampaignUrl;
  private useMockApi = true;

  getPrizes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetCampaignPrize?type=${1}`);
  }

  saveResult(request: SaveUserPrizeRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveUserPrize`, request);
  }

  getEligibility(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetWheelEligibility`);
  }
}
