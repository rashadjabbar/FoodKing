export class TournamentMatch {
  id!: number;
  homeTeam!: string;
  awayTeam!: string;
  matchDate!: string;
  status!: 'NotStarted' | 'Started' | 'Finished';
}

export type PredictionStatus = 'Pending' | 'Won' | 'Lost';

export class MatchPredictionItem {
  matchId!: number;
  predictedHomeScore!: number | null;
  predictedAwayScore!: number | null;
}

export class SaveMatchPredictionsRequest {
  matchId!: number;
  predictedHomeScore!: number | null;
  predictedAwayScore!: number | null;
}

export class MatchPredictionHistoryItem {
  matchId!: number;
  homeTeam!: string;
  awayTeam!: string;
  matchDate!: string;
  predictedHomeScore!: number;
  predictedAwayScore!: number;
  homeScore?: number;
  awayScore?: number;
  predictionStatus!: PredictionStatus;
  userName?: string;
}

export class WheelEligibility {
  isActive!: boolean;
  message?: string;
}
