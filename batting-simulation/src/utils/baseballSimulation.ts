import { Player, GameStats, AtBatResult } from '../types/baseball';

// OPS計算関数
export function calculateOPS(player: Player): number {
  const totalPlateAppearances = player.atBats + player.walks + player.hitByPitch + player.sacrificeFlies;
  if (totalPlateAppearances === 0) return 0;

  const onBasePercentage = (player.hits + player.walks + player.hitByPitch) / totalPlateAppearances;
  const sluggingPercentage = (player.hits - player.doubles - player.triples - player.homeRuns + 
                             2 * player.doubles + 3 * player.triples + 4 * player.homeRuns) / player.atBats;

  return onBasePercentage + sluggingPercentage;
}

// 打撃結果をシミュレートする関数
export function simulateAtBat(player: Player): AtBatResult {
  const ops = calculateOPS(player);
  
  // OPSに基づいて確率を調整
  const baseHitRate = Math.min(0.4, ops * 0.3); // 基本安打率
  const walkRate = Math.min(0.15, ops * 0.1); // 四球率
  const extraBaseHitRate = Math.min(0.1, ops * 0.05); // 長打率
  
  const random = Math.random();
  
  if (random < walkRate) {
    return { result: 'walk', description: '四球' };
  } else if (random < walkRate + 0.02) {
    return { result: 'hitByPitch', description: '死球' };
  } else if (random < walkRate + 0.02 + baseHitRate) {
    // 安打の種類を決定
    const hitRandom = Math.random();
    if (hitRandom < 0.7) {
      return { result: 'single', description: '単打' };
    } else if (hitRandom < 0.85) {
      return { result: 'double', description: '2塁打' };
    } else if (hitRandom < 0.95) {
      return { result: 'triple', description: '3塁打' };
    } else {
      return { result: 'homeRun', description: '本塁打' };
    }
  } else if (random < walkRate + 0.02 + baseHitRate + 0.05) {
    return { result: 'sacrificeFly', description: '犠飛' };
  } else {
    return { result: 'out', description: 'アウト' };
  }
}

// イニングをシミュレートする関数
export function simulateInning(batters: Player[], isTop: boolean, startBatterIndex: number = 0): { 
  runs: number; 
  gameStats: GameStats[]; 
  nextBatterIndex: number 
} {
  const gameStats: GameStats[] = batters.map(player => ({
    atBats: 0,
    hits: 0,
    doubles: 0,
    triples: 0,
    homeRuns: 0,
    walks: 0,
    hitByPitch: 0,
    sacrificeFlies: 0,
    runs: 0,
    rbis: 0
  }));

  let runs = 0;
  let outs = 0;
  let bases = [false, false, false]; // 1塁、2塁、3塁
  let currentBatterIndex = startBatterIndex;

  while (outs < 3) {
    const currentBatter = batters[currentBatterIndex];
    const atBatResult = simulateAtBat(currentBatter);
    
    // 統計を更新
    gameStats[currentBatterIndex].atBats++;
    
    switch (atBatResult.result) {
      case 'walk':
      case 'hitByPitch':
        gameStats[currentBatterIndex][atBatResult.result === 'walk' ? 'walks' : 'hitByPitch']++;
        // ベースを進める
        if (bases[0]) {
          if (bases[1]) {
            if (bases[2]) {
              runs++;
              gameStats[currentBatterIndex].rbis++;
            }
            bases[2] = true;
          }
          bases[1] = true;
        }
        bases[0] = true;
        break;
        
      case 'single':
        gameStats[currentBatterIndex].hits++;
        // ランナーを進める
        if (bases[2]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[1]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[0]) {
          bases[2] = true;
        }
        bases[1] = false;
        bases[0] = true;
        break;
        
      case 'double':
        gameStats[currentBatterIndex].hits++;
        gameStats[currentBatterIndex].doubles++;
        // ランナーを進める
        if (bases[2]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[1]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[0]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        bases[2] = false;
        bases[1] = true;
        bases[0] = false;
        break;
        
      case 'triple':
        gameStats[currentBatterIndex].hits++;
        gameStats[currentBatterIndex].triples++;
        // 全ランナーがホームイン
        if (bases[2]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[1]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[0]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        bases[2] = true;
        bases[1] = false;
        bases[0] = false;
        break;
        
      case 'homeRun':
        gameStats[currentBatterIndex].hits++;
        gameStats[currentBatterIndex].homeRuns++;
        // 全ランナー + 打者本人がホームイン
        if (bases[2]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[1]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        if (bases[0]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
        }
        runs++;
        gameStats[currentBatterIndex].rbis++;
        bases = [false, false, false];
        break;
        
      case 'sacrificeFly':
        gameStats[currentBatterIndex].sacrificeFlies++;
        outs++;
        if (bases[2]) {
          runs++;
          gameStats[currentBatterIndex].rbis++;
          bases[2] = false;
        }
        break;
        
      case 'out':
        outs++;
        break;
    }
    
    currentBatterIndex = (currentBatterIndex + 1) % batters.length;
  }
  
  return { runs, gameStats, nextBatterIndex: currentBatterIndex };
} 