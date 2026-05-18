import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';
import {
  MatchPredictionHistoryItem,
  MatchPredictionItem,
  PopularPredictionStat,
  PredictionStatus,
  TournamentMatch
} from 'src/models/match-prediction';
import { GlobalService } from 'src/services/global.service';
import { MatchPredictionService } from 'src/services/match-prediction.service';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/utils/alert';
import { LuckyWheelComponent } from '../wheel/lucky-wheel/lucky-wheel.component';

type PopularPredictionViewModel = {
  scoreLabel: string;
  percentageLabel: string;
  percentageValue: number;
};

@Component({
  selector: 'app-match-prediction',
  templateUrl: './match-prediction.component.html',
  styleUrls: ['./match-prediction.component.scss']
})
export class MatchPredictionComponent implements OnInit {
  private readonly couponPrice = 0.26;
  private readonly predictionChargeStorageKey = 'match_prediction_charge_date';

  matches: TournamentMatch[] = [];
  predictionHistory: MatchPredictionHistoryItem[] = [];
  predictions: Record<number, MatchPredictionItem> = {};
  isAdmin = false;
  isLoading = false;
  isSaving = false;
  isHistoryLoading = false;
  wheelEligible = false;
  wheelMessage = '';
  historyFilter: 'all' | 'today' | 'yesterday' | 'date' = 'all';
  selectedHistoryDate = '';

  constructor(
    private matchPredictionService: MatchPredictionService,
    private dialog: MatDialog,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.setUserRole();
    this.loadMatches();
    this.loadPredictionHistory();
    this.loadWheelEligibility();
  }

  loadMatches() {
    this.isLoading = true;

    this.matchPredictionService.getTodayMatches().subscribe({
      next: res => {
        this.syncMatches(res?.data ?? []);
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
        showErrorAlert('', 'Təxmin tarixçəsi yüklənmədi', false, false, '', '', 1800);
      }
    });
  }

  get filteredPredictionHistory() {
    if (this.historyFilter === 'all') {
      return this.predictionHistory;
    }

    const today = new Date();

    if (this.historyFilter === 'today') {
      return this.predictionHistory.filter(item => this.isSameCalendarDate(item.matchDate, today));
    }

    if (this.historyFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return this.predictionHistory.filter(item => this.isSameCalendarDate(item.matchDate, yesterday));
    }

    if (!this.selectedHistoryDate) {
      return this.predictionHistory;
    }

    return this.predictionHistory.filter(item => this.isSameCalendarDate(item.matchDate, this.selectedHistoryDate));
  }

  onHistoryFilterChange() {
    if (this.historyFilter !== 'date') {
      this.selectedHistoryDate = '';
    }
  }

  submitPredictions() {
    if (this.isSaving) {
      return;
    }

    const localFilledPredictions = this.getFilledPredictions(this.matches);

    if (localFilledPredictions.length === 0) {
      showErrorAlert('', 'Ən azı bir oyun üçün təxmin daxil edin', false, false, '', '', 1800);
      return;
    }

    const shouldChargeForToday = !this.hasChargedForToday();

    if (!shouldChargeForToday) {
      this.executePredictionSubmit(localFilledPredictions, false);
      return;
    }

    showConfirmAlert(
      '',
      `Təxmin göndərildikdə balansınızdan ${this.couponPrice.toFixed(2)} ₼ kupon qiyməti silinəcək. Davam edilsin?`,
      'Bəli',
      'Ləğv et'
    ).then(result => {
      if (!result.isConfirmed) {
        return;
      }

      this.executePredictionSubmit(localFilledPredictions, true);
    });
  }

  trackByMatch = (_: number, item: TournamentMatch) => item.id;

  trackByHistory = (index: number, item: MatchPredictionHistoryItem) =>
    `${item.matchId}-${this.getPredictionOwnerLabel(item)}-${index}`;

  trackByPopularPrediction = (_: number, item: PopularPredictionViewModel) => item.scoreLabel;

  getStatusLabel(status: PredictionStatus) {
    if (status === 'Won') {
      return 'Qalib';
    }

    if (status === 'Lost') {
      return 'Uduzdu';
    }

    return 'Gözləmədə';
  }

  getPredictionOwnerLabel(item: MatchPredictionHistoryItem) {
    return item.userName || 'İstifadəçi məlumatı yoxdur';
  }

  isPredictionAllowed(match: TournamentMatch) {
    const normalizedStatus = this.normalizeMatchStatus(match.status);
    return normalizedStatus !== 'started' && normalizedStatus !== 'finished';
  }

  getPredictionLockMessage(match: TournamentMatch) {
    const normalizedStatus = this.normalizeMatchStatus(match.status);

    if (normalizedStatus === 'started') {
      return 'Bu oyun artıq başlayıb, təxmin qəbul edilmir.';
    }

    if (normalizedStatus === 'finished') {
      return 'Bu oyun başa çatıb, təxmin qəbul edilmir.';
    }

    return '';
  }

  getPopularPredictionItems(match: TournamentMatch): PopularPredictionViewModel[] {
    const sourceItems = this.getPopularPredictionSource(match);

    return sourceItems
      .map(item => this.mapPopularPredictionItem(item))
      .filter((item): item is PopularPredictionViewModel => !!item)
      .sort((a, b) => b.percentageValue - a.percentageValue)
      .slice(0, 2);
  }

  hasPopularPredictions(match: TournamentMatch) {
    return this.getPopularPredictionItems(match).length > 0;
  }

  private executePredictionSubmit(localFilledPredictions: MatchPredictionItem[], shouldChargeForToday: boolean) {
    this.isSaving = true;

    this.matchPredictionService.getTodayMatches().subscribe({
      next: res => {
        const latestMatches: TournamentMatch[] = res?.data ?? [];
        this.syncMatches(latestMatches);

        const filledPredictions = this.getFilledPredictions(latestMatches);

        if (filledPredictions.length === 0) {
          this.isSaving = false;
          showErrorAlert(
            '',
            'Bəzi oyunların statusu dəyişib. Artıq başlamış və ya bitmiş oyunlara təxmin göndərilə bilməz.',
            false,
            false,
            '',
            '',
            2400
          );
          return;
        }

        this.matchPredictionService.savePredictions(filledPredictions).subscribe({
          next: saveRes => {
            this.isSaving = false;

            if (saveRes?.isSuccess === false) {
              showErrorAlert('', saveRes?.message ?? 'Təxminlər göndərilmədi', false, false, '', '', 1800);
              return;
            }

            const lockedPredictionsCount = localFilledPredictions.length - filledPredictions.length;
            const baseMessage = saveRes?.message ?? 'Təxminləriniz qeyd alındı';

            if (lockedPredictionsCount > 0) {
              showInfoAlert(
                '',
                `${lockedPredictionsCount} oyun artıq bağlı olduğu üçün göndərilmədi. ${baseMessage}`,
                false,
                false,
                '',
                '',
                3200
              );
            } else {
              showInfoAlert(
                '',
                baseMessage,
                false,
                false,
                '',
                '',
                2600
              );
            }

            if (shouldChargeForToday && this.shouldShowBalanceNotice(saveRes?.message)) {
              this.markChargedForToday();
              this.refreshUserBalance();
            }

            this.loadPredictionHistory();
          },
          error: () => {
            this.isSaving = false;
            showErrorAlert('', 'Təxminləri göndərmək mümkün olmadı', false, false, '', '', 1800);
          }
        });
      },
      error: () => {
        this.isSaving = false;
        showErrorAlert('', 'Oyun statuslarını yeniləmək mümkün olmadı', false, false, '', '', 1800);
      }
    });
  }

  private hasChargedForToday() {
    return localStorage.getItem(this.predictionChargeStorageKey) === this.getTodayStorageValue();
  }

  private markChargedForToday() {
    localStorage.setItem(this.predictionChargeStorageKey, this.getTodayStorageValue());
  }

  private getTodayStorageValue() {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private setUserRole() {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {
      const data: any = jwt_decode(token);
      const userType = Number(data?.userType);
      this.isAdmin = userType === 1 || userType === 4;
    } catch {
      this.isAdmin = false;
    }
  }

  private syncMatches(matches: TournamentMatch[]) {
    this.matches = matches;

    this.matches.forEach(match => {
      const existingPrediction = this.predictions[match.id];

      this.predictions[match.id] = {
        matchId: match.id,
        predictedHomeScore: existingPrediction?.predictedHomeScore ?? null,
        predictedAwayScore: existingPrediction?.predictedAwayScore ?? null
      };
    });
  }

  private getFilledPredictions(matches: TournamentMatch[]) {
    return matches
      .filter(match => this.isPredictionAllowed(match))
      .map(match => this.predictions[match.id])
      .filter(item => item?.predictedHomeScore !== null && item?.predictedAwayScore !== null);
  }

  private getPopularPredictionSource(match: TournamentMatch): PopularPredictionStat[] {
    return Array.isArray(match.popularPredictions) ? match.popularPredictions : [];
  }

  private mapPopularPredictionItem(item: PopularPredictionStat | any): PopularPredictionViewModel | null {
    const homeScore = this.toNumber(item?.predictedHomeScore ?? item?.homeScore ?? item?.home);
    const awayScore = this.toNumber(item?.predictedAwayScore ?? item?.awayScore ?? item?.away);
    const percentage = this.toNumber(item?.percentage ?? item?.percent ?? item?.rate);

    if (homeScore === null || awayScore === null) {
      return null;
    }

    return {
      scoreLabel: `${homeScore} - ${awayScore}`,
      percentageLabel: percentage !== null ? `%${this.formatPercentage(percentage)}` : '-',
      percentageValue: percentage ?? 0
    };
  }

  private toNumber(value: unknown) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : null;
    }

    return null;
  }

  private formatPercentage(value: number) {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }

  private isSameCalendarDate(matchDate: string, compareDate: string | Date) {
    const match = new Date(matchDate);
    const compare = typeof compareDate === 'string' ? new Date(compareDate) : compareDate;

    return (
      match.getFullYear() === compare.getFullYear() &&
      match.getMonth() === compare.getMonth() &&
      match.getDate() === compare.getDate()
    );
  }

  private normalizeMatchStatus(status: TournamentMatch['status'] | string | null | undefined) {
    const normalized = (status ?? '').toString().trim().toLocaleLowerCase('az');

    if (['started', 'top oyundadir', 'top oyundadır'].includes(normalized)) {
      return 'started';
    }

    if (['finished', 'bitib'].includes(normalized)) {
      return 'finished';
    }

    return 'not-started';
  }

  private shouldShowBalanceNotice(message: string | undefined) {
    const normalizedMessage = (message ?? '').toLocaleLowerCase('az');
    return !normalizedMessage.includes('artıq bazada mövcuddur');
  }

  private refreshUserBalance() {
    this.globalService.getUserBalance().subscribe({
      next: res => this.globalService.setUserBalance(res?.data ?? null)
    });
  }
}
