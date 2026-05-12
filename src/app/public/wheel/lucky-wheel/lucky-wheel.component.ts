import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LuckyWheelEligibility, LuckyWheelPrize } from 'src/models/lucky-wheel';
import { LuckyWheelService } from 'src/services/lucky-wheel.service';

@Component({
  selector: 'app-lucky-wheel',
  templateUrl: './lucky-wheel.component.html',
  styleUrls: ['./lucky-wheel.component.scss']
})
export class LuckyWheelComponent implements OnInit, OnDestroy {
  constructor(
    private dialogRef: MatDialogRef<LuckyWheelComponent>,
    private luckyWheelService: LuckyWheelService
  ) {}

  private readonly spinStateKey = 'luckyWheelSpinState';
  private readonly spinDurationMs = 4000;
  private revealPrizeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  segments: LuckyWheelPrize[] = [];

  rotation = 0;
  prize: string | null = null;
  prizeId: number | null = null;
  showPrize = false;
  isSpinning = false;
  isLoading = false;
  hasPlayed = false;
  isEligible = false;
  eligibilityMessage = '';
  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  eligibility?: LuckyWheelEligibility;

  ngOnInit() {
    this.loadEligibility();
  }

  ngOnDestroy() {
    if (this.revealPrizeTimeoutId) {
      clearTimeout(this.revealPrizeTimeoutId);
    }
  }

  spinWheel() {
    if (this.isSpinning || this.hasPlayed || this.segments.length === 0) {
      return;
    }

    this.isSpinning = true;
    this.showPrize = false;
    this.feedbackMessage = '';

    const segmentAngle = 360 / this.segments.length;
    const prizeIndex = this.selectPrizeIndexByWeight();
    const segmentCenter = (prizeIndex * segmentAngle) + (segmentAngle / 2);
    const pointerAngle = 360;
    const targetAngle = pointerAngle - segmentCenter;
    const normalizedTargetAngle = (targetAngle + 360) % 360;
    const extraRotations = (Math.floor(Math.random() * 4) + 6) * 360;

    const selectedPrize = this.segments[prizeIndex];

    this.prize = selectedPrize.name;
    this.prizeId = selectedPrize.id;
    this.rotation += extraRotations + normalizedTargetAngle;

    this.saveSpinResult(selectedPrize);
  }

  closeDialog() {
    this.dialogRef.close(this.prize);
  }

  private selectPrizeIndexByWeight(): number {
    const weights = this.segments.map(item => item.weight ?? 1);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    let random = Math.random() * totalWeight;

    for (let index = 0; index < weights.length; index++) {
      random -= weights[index];
      if (random <= 0) {
        return index;
      }
    }

    return this.segments.length - 1;
  }

  private loadEligibility() {
    this.isLoading = true;

    this.luckyWheelService.getEligibility().subscribe({
      next: res => {
        this.eligibility = res?.data;
        this.isEligible = !!res?.data?.isActive;
        this.eligibilityMessage = res?.data?.message ?? '';
        this.restoreSpinState();

        if (!this.isEligible) {
          this.isLoading = false;
          return;
        }

        this.loadPrizes();
      },
      error: () => {
        this.isLoading = false;
        this.setFeedback('Çarx aktivlik statusu yüklənmədi', 'error');
      }
    });
  }

  private loadPrizes() {
    this.luckyWheelService.getPrizes().subscribe({
      next: res => {
        this.segments = res?.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.setFeedback('Çarx məlumatları yüklənmədi', 'error');
      }
    });
  }

  private saveSpinResult(selectedPrize: LuckyWheelPrize) {
    this.luckyWheelService.saveResult({ prizeId: selectedPrize.id }).subscribe({
      next: res => {
        if (res?.isSuccess === false) {
          this.finishSpinWithError(res?.message ?? 'Nəticə yadda saxlanılmadı');
          return;
        }

        this.hasPlayed = true;
        this.persistSpinState(selectedPrize);
        this.finishSpinWithSuccess();
      },
      error: () => {
        this.finishSpinWithError('Nəticə API-yə göndərilə bilmədi');
      }
    });
  }

  private finishSpinWithSuccess() {
    this.scheduleSpinCompletion(() => {
      this.showPrize = true;
      this.isSpinning = false;
      this.feedbackMessage = '';
    });
  }

  private finishSpinWithError(message: string) {
    this.scheduleSpinCompletion(() => {
      this.showPrize = false;
      this.isSpinning = false;
      this.setFeedback(message, 'error');
    });
  }

  private scheduleSpinCompletion(callback: () => void) {
    if (this.revealPrizeTimeoutId) {
      clearTimeout(this.revealPrizeTimeoutId);
    }

    this.revealPrizeTimeoutId = setTimeout(() => {
      this.revealPrizeTimeoutId = null;
      callback();
    }, this.spinDurationMs);
  }

  private restoreSpinState() {
    const savedState = localStorage.getItem(this.spinStateKey);

    if (!savedState) {
      return;
    }

    try {
      const parsedState = JSON.parse(savedState);
      const savedDate = parsedState?.playedOn;

      if (savedDate !== this.getTodayKey()) {
        localStorage.removeItem(this.spinStateKey);
        return;
      }

      this.hasPlayed = true;
      this.prize = parsedState?.prizeLabel ?? null;
      this.prizeId = parsedState?.prizeId ?? null;
      this.showPrize = !!parsedState?.prizeId;
    } catch {
      localStorage.removeItem(this.spinStateKey);
    }
  }

  private persistSpinState(selectedPrize: LuckyWheelPrize) {
    localStorage.setItem(this.spinStateKey, JSON.stringify({
      playedOn: this.getTodayKey(),
      prizeId: selectedPrize.id,
      prizeLabel: selectedPrize.name
    }));
  }

  private setFeedback(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.feedbackMessage = message;
    this.feedbackType = type;
  }

  private getTodayKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
