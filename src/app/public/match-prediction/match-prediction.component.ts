import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatchPredictionHistoryItem,
  MatchPredictionItem,
  PredictionStatus,
  SaveMatchPredictionsRequest,
  TournamentMatch
} from 'src/models/match-prediction';
import { LuckyWheelComponent } from '../wheel/lucky-wheel/lucky-wheel.component';
import { MatchPredictionService } from 'src/services/match-prediction.service';
import { showErrorAlert, showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-match-prediction',
  templateUrl: './match-prediction.component.html',
  styleUrls: ['./match-prediction.component.scss']
})
export class MatchPredictionComponent implements OnInit {
  matches: TournamentMatch[] = [];
  predictionHistory: MatchPredictionHistoryItem[] = [];
  predictions: Record<number, MatchPredictionItem> = {};
  isLoading = false;
  isSaving = false;
  isHistoryLoading = false;
  wheelEligible = false;
  wheelMessage = '';

  constructor(
    private matchPredictionService: MatchPredictionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMatches();
    this.loadPredictionHistory();
    this.loadWheelEligibility();
  }

  loadMatches() {
    this.isLoading = true;

    this.matchPredictionService.getTodayMatches().subscribe({
      next: res => {
       
        this.matches = res?.data ?? [];
        this.matches.forEach(match => {
          this.predictions[match.id] = {
            matchId: match.id,
            predictedHomeScore: null,
            predictedAwayScore: null
          };
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        showErrorAlert('', 'Günün oyunları yüklənmədi', false, false, '', '', 1800);
      }
    });
  }

  loadWheelEligibility() {
    this.matchPredictionService.getWheelEligibility().subscribe({
      next: res => {
        this.wheelEligible = !!res?.data?.isActive;
        this.wheelMessage = res?.data?.message ?? '';
      }
    });
  }

  openLuckyWheelPopup() {
    if (!this.wheelEligible) {
      return;
    }

    this.dialog.open(LuckyWheelComponent, {
      width: 'min(92vw, 520px)',
      maxWidth: '92vw',
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false,
      panelClass: 'lucky-wheel-dialog'
    });
  }

  loadPredictionHistory() {
    this.isHistoryLoading = true;
    this.matchPredictionService.getMatchPredictions().subscribe({
      next: res => {
        this.predictionHistory = res?.data ?? [];
        this.isHistoryLoading = false;
      },
      error: () => {
        this.isHistoryLoading = false;
        showErrorAlert('', 'Təxmin tarixcesi yüklənmedi', false, false, '', '', 1800);
      }
    });
  }

  submitPredictions() {
    if (this.isSaving) {
      return;
    }

    const filledPredictions: SaveMatchPredictionsRequest[] = Object.values(this.predictions).filter(item =>
      item.predictedHomeScore !== null && item.predictedAwayScore !== null
    );

    if (filledPredictions.length === 0) {
      showErrorAlert('', 'Ən azı bir oyun üçün təxmin daxil edin', false, false, '', '', 1800);
      return;
    }

    this.isSaving = true;

    this.matchPredictionService.savePredictions(filledPredictions).subscribe({
      next: res => {
        this.isSaving = false;
        if (res?.isSuccess === false) {
          showErrorAlert('', res?.message ?? 'Təxminlər göndərilmədi', false, false, '', '', 1800);
          return;
        }

        showInfoAlert('', res?.message ?? 'Təxminləriniz qeydə alındı', false, false, '', '', 1800);
        this.loadPredictionHistory();
      },
      error: () => {
        this.isSaving = false;
        showErrorAlert('', 'Təxminləri göndərmək mümkün olmadı', false, false, '', '', 1800);
      }
    });
  }

  trackByMatch(_: number, item: TournamentMatch) {
    return item.id;
  }

  trackByHistory(_: number, item: MatchPredictionHistoryItem) {
    return item.matchId;
  }

  getStatusLabel(status: PredictionStatus) {
    if (status === 'Won') {
      return 'Qalib';
    }

    if (status === 'Lost') {
      return 'Uduzdu';
    }

    return 'Gözləmədə';
  }
}
