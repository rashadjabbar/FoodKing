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
    if (this.useMockApi) {
      return of({
        isSuccess: true,
        data: [
          { id: 1, name: 'Su hədiyyəsi', color: '#f8d54b', weight: 30 },
          { id: 2, name: 'Telefon', color: '#f29f67', weight: 3 },
          { id: 3, name: '10% endirim', color: '#82c884', weight: 18 },
          { id: 4, name: 'Pulsuz çatdırılma', color: '#7ec8e3', weight: 22 },
          { id: 5, name: 'Bonus xalları', color: '#ff8fab', weight: 15 },
          { id: 6, name: 'Surpriz hədiyyə', color: '#cdb4db', weight: 12 },
          { id: 7, name: '20% endirim', color: '#ffb703', weight: 6 }
        ] as LuckyWheelPrize[]
      });
    }

    return this.http.get<any>(`${this.baseUrl}GetCampaignPrize?type=${1}`);
  }

  saveResult(request: SaveUserPrizeRequest): Observable<any> {
    if (this.useMockApi) {
      return of({
        isSuccess: true,
        message: 'Hədiyyəniz qeydə alındı',
        data: request
      });
    }

    return this.http.post<any>(`${this.baseUrl}SaveUserPrize`, request);
  }

  getEligibility(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetWheelEligibility`);
  }
}
