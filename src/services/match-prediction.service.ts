import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environments';
import {
  MatchPredictionHistoryItem,
  SaveMatchPredictionsRequest,
  TournamentMatch,
  WheelEligibility
} from 'src/models/match-prediction';

@Injectable({
  providedIn: 'root'
})
export class MatchPredictionService {
  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiCampaignUrl}`;
  private useMockApi = true;

  getTodayMatches(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetTodayMatches`);
  }

  savePredictions(request: SaveMatchPredictionsRequest[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SaveMatchPredictions`, request);
  }

  getMatchPredictions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetMatchPredictions`);
  }

  getWheelEligibility(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetWheelEligibility`);
  }
}
