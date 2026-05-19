import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MatchPredictionHistoryItem,
  MatchPredictionItem,
  PopularPredictionStat,
  PredictionStatus,
  TournamentMatch
} from 'src/models/match-prediction';
import { GlobalService } from 'src/services/global.service';
import { MatchPredictionService } from 'src/services/match-prediction.service';
import { PredictionValidatorService } from 'src/services/prediction-validator.service';
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
export class MatchPredictionComponent implements OnInit, OnDestroy {
  private readonly couponPrice = 0.26;
  private readonly predictionChargeStorageKey = 'match_prediction_charge_date';
  private readonly successHighlightDurationMs = 2600;
  private readonly STATUS_WON = 'Won';
  private readonly STATUS_LOST = 'Lost';
  private readonly STATUS_PENDING = 'Pending';

  private destroy$ = new Subject<void>();

  private currentUserId: number | null = null;
  private currentUsername = '';
  matches: TournamentMatch[] = [];
  predictionHistory: MatchPredictionHistoryItem[] = [];
  predictions: Record<number, MatchPredictionItem> = {};
  successHighlightedMatchIds = new Set<number>();
  isAdmin = false;
  isLoading = false;
  isSaving = false;
  isHistoryLoading = false;
  wheelEligible = false;
  wheelMessage = '';
  historyFilter: 'all' | 'today' | 'yesterday' | 'date' = 'all';
  selectedHistoryDate = '';
  now = new Date();
  private refreshIntervalId: number | null = null;
  private countdownIntervalId: number | null = null;
  private readonly liveRefreshIntervalMs = 60000;
  private readonly countdownTickMs = 1000;
  private lastMatchStatusMap = new Map<number, string>();
  private lastPredictionStatusMap = new Map<number, PredictionStatus>();

  constructor(
    private matchPredictionService: MatchPredictionService,
    private dialog: MatDialog,
    private globalService: GlobalService
    ,
    private predictionValidator: PredictionValidatorService
  ) {}

  ngOnInit(): void {
    this.setUserRole();
    this.loadMatches();
    this.loadPredictionHistory();
    this.loadWheelEligibility();
    this.startLiveUpdates();
  }

  ngOnDestroy(): void {
    this.stopLiveUpdates();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get hasPaidPredictionFeeToday() {
    return this.hasChargedForToday();
  }

  get todayPredictionCount() {
    const today = new Date();
    const uniqueMatchIds = new Set<number>();

    // Tarixçədən bugünkü təxminləri əlavə et (yalnız cari istifadəçiyə aid olanları)
    this.predictionHistory
      .filter(item => this.isSameCalendarDate(item.matchDate, today) && this.isPredictionOwnedByCurrentUser(item))
      .forEach(item => uniqueMatchIds.add(item.matchId));

    // Formdakı doldurulmuş təxminləri əlavə et (hələ göndərilməyənləri)
    Object.entries(this.predictions)
      .filter(([_, pred]) => pred?.predictedHomeScore !== null && pred?.predictedAwayScore !== null)
      .forEach(([matchIdStr, _]) => uniqueMatchIds.add(Number(matchIdStr)));

    return uniqueMatchIds.size;
  }

  get availablePredictionCount() {
    return this.matches.length;
  }

  loadMatches() {
    this.isLoading = true;

    this.matchPredictionService
      .getTodayMatches()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.matchPredictionService
      .getWheelEligibility()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.matchPredictionService
      .getMatchPredictions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.predictionHistory = res?.data ?? [];
          this.applyHistoryPredictionsToInputs();
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

  fillPredictionFromPopular(match: TournamentMatch, scoreLabel: string) {
    if (!this.isPredictionAllowed(match)) {
      return;
    }

    const [homeScore, awayScore] = scoreLabel.split('-').map(part => Number(part.trim()));

    if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) {
      return;
    }

    this.predictions[match.id] = {
      matchId: match.id,
      predictedHomeScore: homeScore,
      predictedAwayScore: awayScore
    };
  }

  hasSavedPredictionForMatch(match: TournamentMatch) {
    return !!this.getTodayPredictionForMatch(match.id);
  }

  isSuccessHighlighted(match: TournamentMatch) {
    return this.successHighlightedMatchIds.has(match.id);
  }

  trackByMatch = (_: number, item: TournamentMatch) => item.id;

  trackByHistory = (index: number, item: MatchPredictionHistoryItem) =>
    `${item.matchId}-${this.getPredictionOwnerLabel(item)}-${index}`;

  trackByPopularPrediction = (_: number, item: PopularPredictionViewModel) => item.scoreLabel;

  getStatusLabel(status: PredictionStatus) {
    if (status === this.STATUS_WON) {
      return 'Qalib';
    }

    if (status === this.STATUS_LOST) {
      return 'Uduzdu';
    }

    return 'Gözləmədə';
  }

  getPredictionOwnerLabel(item: MatchPredictionHistoryItem) {
    return item.userName || 'İstifadəçi məlumatı yoxdur';
  }

  isPredictionAllowed(match: TournamentMatch) {
    return this.predictionValidator.isPredictionAllowed(match);
  }

  getPredictionLockMessage(match: TournamentMatch) {
    return this.predictionValidator.getPredictionLockMessage(match);
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

    this.matchPredictionService
      .getTodayMatches()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

        this.matchPredictionService
          .savePredictions(filledPredictions)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
          next: saveRes => {
            this.isSaving = false;

            if (saveRes?.isSuccess === false) {
              showErrorAlert('', this.getFriendlyDuplicateMessage(saveRes?.message ?? 'Təxminlər göndərilmədi'), false, false, '', '', 1800);
              return;
            }

            const lockedPredictionsCount = localFilledPredictions.length - filledPredictions.length;
            const baseMessage = this.getFriendlyDuplicateMessage(saveRes?.message ?? 'Təxminləriniz qeyd alındı');

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
              showInfoAlert('', baseMessage, false, false, '', '', 2600);
            }

            this.markSuccessHighlights(filledPredictions.map(item => item.matchId));

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
      this.currentUserId = null;
      this.currentUsername = '';
      return;
    }

    try {
      const data: any = jwt_decode(token);
      const userType = Number(data?.userType);
      this.currentUserId = this.extractCurrentUserId(data);
      this.currentUsername = this.extractCurrentUsername(data);
      this.isAdmin = userType === 1 || userType === 4;
    } catch {
      this.currentUserId = null;
      this.currentUsername = '';
      this.isAdmin = false;
    }
  }

  private syncMatches(matches: TournamentMatch[]) {
    this.matches = matches;
    this.updateLastMatchStatuses(matches);

    this.matches.forEach(match => {
      const existingPrediction = this.predictions[match.id];
      const historyPrediction = this.getTodayPredictionForMatch(match.id);

      this.predictions[match.id] = {
        matchId: match.id,
        predictedHomeScore:
          existingPrediction?.predictedHomeScore ?? historyPrediction?.predictedHomeScore ?? null,
        predictedAwayScore:
          existingPrediction?.predictedAwayScore ?? historyPrediction?.predictedAwayScore ?? null
      };
    });
  }

  private applyHistoryPredictionsToInputs() {
    if (this.matches.length === 0) {
      return;
    }

    this.matches.forEach(match => {
      const historyPrediction = this.getTodayPredictionForMatch(match.id);

      if (!historyPrediction) {
        return;
      }

      this.predictions[match.id] = {
        matchId: match.id,
        predictedHomeScore: historyPrediction.predictedHomeScore,
        predictedAwayScore: historyPrediction.predictedAwayScore
      };
    });
  }

  private getFilledPredictions(matches: TournamentMatch[]) {
    return matches
      .filter(match => this.isPredictionAllowed(match))
      .map(match => this.predictions[match.id])
      .filter(item => item?.predictedHomeScore !== null && item?.predictedAwayScore !== null);
  }

  private getTodayPredictionForMatch(matchId: number) {
    const today = new Date();
    for (let index = this.predictionHistory.length - 1; index >= 0; index--) {
      const item = this.predictionHistory[index];

      if (
        item.matchId === matchId &&
        this.isSameCalendarDate(item.matchDate, today) &&
        this.isPredictionOwnedByCurrentUser(item)
      ) {
        return item;
      }
    }

    return undefined;
  }

  private startLiveUpdates() {
    this.stopLiveUpdates();
    this.refreshLiveData();
    this.startCountdown();
    this.refreshIntervalId = window.setInterval(() => {
      this.refreshLiveData();
    }, this.liveRefreshIntervalMs);
  }

  private stopLiveUpdates() {
    if (this.refreshIntervalId !== null) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }

    if (this.countdownIntervalId !== null) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }

  private startCountdown() {
    if (this.countdownIntervalId !== null) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }

    this.countdownIntervalId = window.setInterval(() => {
      this.now = new Date();
    }, this.countdownTickMs);
  }

  private refreshLiveData() {
    forkJoin({
      matchesRes: this.matchPredictionService.getTodayMatches(),
      historyRes: this.matchPredictionService.getMatchPredictions()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ matchesRes, historyRes }) => {
          const latestMatches: TournamentMatch[] = matchesRes?.data ?? [];
          this.handleMatchStatusUpdates(latestMatches);
          this.syncMatches(latestMatches);

          const latestHistory: MatchPredictionHistoryItem[] = historyRes?.data ?? [];
          this.handlePredictionHistoryUpdates(latestHistory);
          this.predictionHistory = latestHistory;
          this.applyHistoryPredictionsToInputs();
        }
      });
  }

  private handleMatchStatusUpdates(latestMatches: TournamentMatch[]) {
    latestMatches.forEach(match => {
      const matchId = match.id;
      const newStatus = (match.status ?? 'not-started').toString().trim();
      const oldStatus = this.lastMatchStatusMap.get(matchId);

      if (oldStatus && oldStatus !== newStatus) {
        if (oldStatus === 'not-started' && newStatus === 'started') {
          showInfoAlert('', `${match.homeTeam} - ${match.awayTeam} oyunu başladı.`, false, false, '', '', 2600);
        }

        if (oldStatus !== 'finished' && newStatus === 'finished') {
          showInfoAlert('', `${match.homeTeam} - ${match.awayTeam} oyunu bitdi. Nəticə tezliklə yenilənəcək.`, false, false, '', '', 2600);
        }
      }

      this.lastMatchStatusMap.set(matchId, newStatus);
    });
  }

  private handlePredictionHistoryUpdates(latestHistory: MatchPredictionHistoryItem[]) {
    const oldStatusMap = new Map<number, PredictionStatus>();

    this.predictionHistory
      .filter(item => this.isPredictionOwnedByCurrentUser(item))
      .forEach(item => oldStatusMap.set(item.matchId, item.predictionStatus));

    latestHistory
      .filter(item => this.isPredictionOwnedByCurrentUser(item))
      .forEach(item => {
        const matchId = item.matchId;
        const oldStatus = oldStatusMap.get(matchId) ?? this.lastPredictionStatusMap.get(matchId);

        if (oldStatus === this.STATUS_PENDING && item.predictionStatus !== this.STATUS_PENDING) {
          const resultLabel = item.predictionStatus === this.STATUS_WON ? 'qazandınız' : 'uduzdunuz';
          showInfoAlert('', `Təxmininiz üçün nəticə gəldi: ${item.homeScore} - ${item.awayScore}, siz ${resultLabel}.`, false, false, '', '', 3200);
        }

        this.lastPredictionStatusMap.set(matchId, item.predictionStatus);
      });
  }

  private markSuccessHighlights(matchIds: number[]) {
    matchIds.forEach(matchId => this.successHighlightedMatchIds.add(matchId));

    setTimeout(() => {
      matchIds.forEach(matchId => this.successHighlightedMatchIds.delete(matchId));
    }, this.successHighlightDurationMs);
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

  

  getMatchCountdownLabel(match: TournamentMatch) {
    const status = (match.status ?? 'not-started').toString().trim();
    const now = this.now;
    const matchDate = new Date(match.matchDate);

    if (status === 'started') {
      return 'Canlı izlənir';
    }

    if (status === 'finished') {
      return 'Oyun tamamlandı';
    }

    const diffMs = matchDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      return 'Başlama vaxtı yaxınlaşır';
    }

    const seconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts: string[] = [];
    if (hours > 0) {
      parts.push(`${hours} saat`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} dəq`);
    }
    parts.push(`${remainingSeconds} san`);

    return `Başlamağa qaldı: ${parts.join(' ')}`;
  }

  private shouldShowBalanceNotice(message: string | undefined) {
    const normalizedMessage = (message ?? '').toLocaleLowerCase('az');
    return !normalizedMessage.includes('artıq bazada mövcuddur');
  }

  private getFriendlyDuplicateMessage(message: string) {
    const normalizedMessage = message.toLocaleLowerCase('az');

    if (normalizedMessage.includes('artıq bazada mövcuddur')) {
      return 'Bu oyun üçün təxmininiz artıq qeyd olunub.';
    }

    return message;
  }

  private refreshUserBalance() {
    this.globalService
      .getUserBalance()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.globalService.setUserBalance(res?.data ?? null)
      });
  }

  private updateLastMatchStatuses(matches: TournamentMatch[]) {
    matches.forEach(match => {
      this.lastMatchStatusMap.set(match.id, (match.status ?? 'not-started').toString().trim());
    });
  }

  private isPredictionOwnedByCurrentUser(item: MatchPredictionHistoryItem) {
    const itemUserId = this.extractPredictionUserId(item);
    if (itemUserId !== null && this.currentUserId !== null) {
      return itemUserId === this.currentUserId;
    }

    return false;
  }

  private extractCurrentUserId(data: any) {
    return this.toNumber(
      data?.userId ??
        data?.id ??
        data?.nameid ??
        data?.nameidentifier ??
        data?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
        data?.sub
    );
  }

  private extractCurrentUsername(data: any) {
    // Keep for display purposes only, not used for comparison
    const value =
      data?.username ??
      data?.unique_name ??
      data?.name ??
      data?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    return typeof value === 'string' ? value.trim().toLocaleLowerCase('az') : '';
  }

  private extractPredictionUserId(item: MatchPredictionHistoryItem) {
    const predictionItem = item as MatchPredictionHistoryItem & Record<string, unknown>;

    return this.toNumber(
      predictionItem.userId ??
        predictionItem['userid'] ??
        predictionItem['userID'] ??
        predictionItem['customerId'] ??
        predictionItem['customerID'] ??
        predictionItem['memberId'] ??
        predictionItem['memberID']
    );
  }
}
