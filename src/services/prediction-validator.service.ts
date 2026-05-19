import { Injectable } from '@angular/core';
import { TournamentMatch } from 'src/models/match-prediction';

@Injectable({ providedIn: 'root' })
export class PredictionValidatorService {
  isPredictionAllowed(match: TournamentMatch) {
    const status = (match.status ?? 'not-started').toString().trim();
    return status !== 'started' && status !== 'finished';
  }

  getPredictionLockMessage(match: TournamentMatch) {
    const status = (match.status ?? 'not-started').toString().trim();

    if (status === 'started') {
      return 'Bu oyun artıq başlayıb, təxmin qəbul edilmir.';
    }

    if (status === 'finished') {
      return 'Bu oyun başa çatıb, təxmin qəbul edilmir.';
    }

    return '';
  }
}
