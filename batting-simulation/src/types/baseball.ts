export interface Player {
  id: string;
  name: string;
  team: 'home' | 'away';
  position: number; // 打順
  atBats: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  walks: number;
  hitByPitch: number;
  sacrificeFlies: number;
}

export interface GameStats {
  atBats: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  walks: number;
  hitByPitch: number;
  sacrificeFlies: number;
  runs: number;
  rbis: number;
}

export interface GameResult {
  homeTeam: {
    name: string;
    score: number;
    players: (Player & GameStats)[];
  };
  awayTeam: {
    name: string;
    score: number;
    players: (Player & GameStats)[];
  };
  innings: {
    home: number[];
    away: number[];
  };
  isComplete: boolean;
}

export interface AtBatResult {
  result: 'single' | 'double' | 'triple' | 'homeRun' | 'walk' | 'hitByPitch' | 'out' | 'sacrificeFly';
  description: string;
} 