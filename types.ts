
export enum GameStatus {
  WAITING = 'WAITING',
  FLYING = 'FLYING',
  CRASHED = 'CRASHED'
}

export interface Signal {
  id: string;
  multiplier: number;
  time: string;
  status: 'SUCCESS' | 'WAITING';
}

export interface PredictionResult {
  nextSignal: number;
  entryTime: string;
  confidence: string;
  analysis: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
