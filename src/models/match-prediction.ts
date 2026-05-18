export class PopularPredictionStat {
  matchId!: number;
  predictedHomeScore!: number;
  predictedAwayScore!: number;
  percentage?: number;
}

export class TournamentMatch {
  id!: number;
  homeTeam!: string;
  awayTeam!: string;
  matchDate!: string;
  status!: 'NotStarted' | 'Started' | 'Finished';
  popularPredictions?: PopularPredictionStat[];
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
