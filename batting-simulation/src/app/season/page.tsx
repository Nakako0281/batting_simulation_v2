'use client';

import { useState, useEffect } from 'react';
import { Player, GameResult, GameStats } from '../../types/baseball';
import { simulateInning, calculateOPS } from '../../utils/baseballSimulation';
import SeasonScoreboard from '../../components/SeasonScoreboard';
import { Container, Stack, Text, Loader, Center, Paper, Title, Button, Group, Progress, Alert } from '@mantine/core';
import { IconBallBaseball, IconRefresh, IconUserEdit, IconTrophy, IconChartBar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface SeasonStats extends GameStats {
  games: number;
  plateAppearances: number;
  onBasePercentage: number;
  sluggingPercentage: number;
}

interface SeasonResult {
  homeTeam: {
    name: string;
    wins: number;
    losses: number;
    ties: number;
    players: (Player & SeasonStats)[];
  };
  awayTeam: {
    name: string;
    wins: number;
    losses: number;
    ties: number;
    players: (Player & SeasonStats)[];
  };
  games: GameResult[];
  isComplete: boolean;
}

export default function SeasonPage() {
  const router = useRouter();
  const [seasonResult, setSeasonResult] = useState<SeasonResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentGame, setCurrentGame] = useState(0);
  const [currentGameResult, setCurrentGameResult] = useState<GameResult | null>(null);

  useEffect(() => {
    // ローカルストレージから試合データを取得
    const gameData = localStorage.getItem('currentGame');
    if (!gameData) {
      // データがない場合はホームページにリダイレクト
      router.push('/home');
      return;
    }

    const { homePlayers, awayPlayers, homeTeamName, awayTeamName } = JSON.parse(gameData);
    simulateSeason(homePlayers, awayPlayers, homeTeamName, awayTeamName);
  }, [router]);

  const simulateSeason = (homePlayers: Player[], awayPlayers: Player[], homeTeamName: string, awayTeamName: string) => {
    setIsSimulating(true);
    setCurrentGame(0);
    
    // シーズン結果の初期化
    const initialSeasonResult: SeasonResult = {
      homeTeam: {
        name: homeTeamName,
        wins: 0,
        losses: 0,
        ties: 0,
        players: homePlayers.map(player => ({
          ...player,
          atBats: 0,
          hits: 0,
          doubles: 0,
          triples: 0,
          homeRuns: 0,
          walks: 0,
          hitByPitch: 0,
          sacrificeFlies: 0,
          runs: 0,
          rbis: 0,
          games: 0,
          plateAppearances: 0,
          onBasePercentage: 0,
          sluggingPercentage: 0
        }))
      },
      awayTeam: {
        name: awayTeamName,
        wins: 0,
        losses: 0,
        ties: 0,
        players: awayPlayers.map(player => ({
          ...player,
          atBats: 0,
          hits: 0,
          doubles: 0,
          triples: 0,
          homeRuns: 0,
          walks: 0,
          hitByPitch: 0,
          sacrificeFlies: 0,
          runs: 0,
          rbis: 0,
          games: 0,
          plateAppearances: 0,
          onBasePercentage: 0,
          sluggingPercentage: 0
        }))
      },
      games: [],
      isComplete: false
    };

    let currentSeasonResult = { ...initialSeasonResult };

    // 143試合をシミュレート
    for (let game = 0; game < 143; game++) {
      // 打者順序を管理する変数
      let awayBatterIndex = 0;
      let homeBatterIndex = 0;

      // ゲーム結果の初期化
      const gameResult: GameResult = {
        homeTeam: {
          name: homeTeamName,
          score: 0,
          players: homePlayers.map(player => ({
            ...player,
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
          }))
        },
        awayTeam: {
          name: awayTeamName,
          score: 0,
          players: awayPlayers.map(player => ({
            ...player,
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
          }))
        },
        innings: {
          home: Array(9).fill(0),
          away: Array(9).fill(0)
        },
        isComplete: false
      };

      // 9イニングをシミュレート
      for (let inning = 0; inning < 9; inning++) {
        // アウェイチームの攻撃（表）
        const awayInningResult = simulateInning(awayPlayers, true, awayBatterIndex);
        gameResult.awayTeam.score += awayInningResult.runs;
        gameResult.innings.away[inning] = awayInningResult.runs;
        awayBatterIndex = awayInningResult.nextBatterIndex;
        
        // アウェイチームの選手統計を更新
        gameResult.awayTeam.players = gameResult.awayTeam.players.map((player, index) => ({
          ...player,
          atBats: player.atBats + awayInningResult.gameStats[index].atBats,
          hits: player.hits + awayInningResult.gameStats[index].hits,
          doubles: player.doubles + awayInningResult.gameStats[index].doubles,
          triples: player.triples + awayInningResult.gameStats[index].triples,
          homeRuns: player.homeRuns + awayInningResult.gameStats[index].homeRuns,
          walks: player.walks + awayInningResult.gameStats[index].walks,
          hitByPitch: player.hitByPitch + awayInningResult.gameStats[index].hitByPitch,
          sacrificeFlies: player.sacrificeFlies + awayInningResult.gameStats[index].sacrificeFlies,
          rbis: player.rbis + awayInningResult.gameStats[index].rbis
        }));

        // ホームチームの攻撃（裏）
        const homeInningResult = simulateInning(homePlayers, false, homeBatterIndex);
        gameResult.homeTeam.score += homeInningResult.runs;
        gameResult.innings.home[inning] = homeInningResult.runs;
        homeBatterIndex = homeInningResult.nextBatterIndex;
        
        // ホームチームの選手統計を更新
        gameResult.homeTeam.players = gameResult.homeTeam.players.map((player, index) => ({
          ...player,
          atBats: player.atBats + homeInningResult.gameStats[index].atBats,
          hits: player.hits + homeInningResult.gameStats[index].hits,
          doubles: player.doubles + homeInningResult.gameStats[index].doubles,
          triples: player.triples + homeInningResult.gameStats[index].triples,
          homeRuns: player.homeRuns + homeInningResult.gameStats[index].homeRuns,
          walks: player.walks + homeInningResult.gameStats[index].walks,
          hitByPitch: player.hitByPitch + homeInningResult.gameStats[index].hitByPitch,
          sacrificeFlies: player.sacrificeFlies + homeInningResult.gameStats[index].sacrificeFlies,
          rbis: player.rbis + homeInningResult.gameStats[index].rbis
        }));
      }

      gameResult.isComplete = true;
      currentSeasonResult.games.push(gameResult);

      // 勝敗を更新
      if (gameResult.homeTeam.score > gameResult.awayTeam.score) {
        currentSeasonResult.homeTeam.wins++;
        currentSeasonResult.awayTeam.losses++;
      } else if (gameResult.awayTeam.score > gameResult.homeTeam.score) {
        currentSeasonResult.awayTeam.wins++;
        currentSeasonResult.homeTeam.losses++;
      } else {
        currentSeasonResult.homeTeam.ties++;
        currentSeasonResult.awayTeam.ties++;
      }

      // シーズン統計を更新
      currentSeasonResult.homeTeam.players = currentSeasonResult.homeTeam.players.map((player, index) => {
        const gamePlayer = gameResult.homeTeam.players[index];
        const totalPlateAppearances = player.plateAppearances + gamePlayer.atBats + gamePlayer.walks + gamePlayer.hitByPitch + gamePlayer.sacrificeFlies;
        const totalAtBats = player.atBats + gamePlayer.atBats;
        
        return {
          ...player,
          atBats: player.atBats + gamePlayer.atBats,
          hits: player.hits + gamePlayer.hits,
          doubles: player.doubles + gamePlayer.doubles,
          triples: player.triples + gamePlayer.triples,
          homeRuns: player.homeRuns + gamePlayer.homeRuns,
          walks: player.walks + gamePlayer.walks,
          hitByPitch: player.hitByPitch + gamePlayer.hitByPitch,
          sacrificeFlies: player.sacrificeFlies + gamePlayer.sacrificeFlies,
          runs: player.runs + gamePlayer.runs,
          rbis: player.rbis + gamePlayer.rbis,
          games: player.games + (gamePlayer.atBats > 0 ? 1 : 0),
          plateAppearances: totalPlateAppearances,
          onBasePercentage: totalPlateAppearances > 0 ? (player.hits + gamePlayer.hits + player.walks + gamePlayer.walks + player.hitByPitch + gamePlayer.hitByPitch) / totalPlateAppearances : 0,
          sluggingPercentage: totalAtBats > 0 ? (player.hits + gamePlayer.hits - player.doubles - gamePlayer.doubles - player.triples - gamePlayer.triples - player.homeRuns - gamePlayer.homeRuns + 
            2 * (player.doubles + gamePlayer.doubles) + 3 * (player.triples + gamePlayer.triples) + 4 * (player.homeRuns + gamePlayer.homeRuns)) / totalAtBats : 0
        };
      });

      currentSeasonResult.awayTeam.players = currentSeasonResult.awayTeam.players.map((player, index) => {
        const gamePlayer = gameResult.awayTeam.players[index];
        const totalPlateAppearances = player.plateAppearances + gamePlayer.atBats + gamePlayer.walks + gamePlayer.hitByPitch + gamePlayer.sacrificeFlies;
        const totalAtBats = player.atBats + gamePlayer.atBats;
        
        return {
          ...player,
          atBats: player.atBats + gamePlayer.atBats,
          hits: player.hits + gamePlayer.hits,
          doubles: player.doubles + gamePlayer.doubles,
          triples: player.triples + gamePlayer.triples,
          homeRuns: player.homeRuns + gamePlayer.homeRuns,
          walks: player.walks + gamePlayer.walks,
          hitByPitch: player.hitByPitch + gamePlayer.hitByPitch,
          sacrificeFlies: player.sacrificeFlies + gamePlayer.sacrificeFlies,
          runs: player.runs + gamePlayer.runs,
          rbis: player.rbis + gamePlayer.rbis,
          games: player.games + (gamePlayer.atBats > 0 ? 1 : 0),
          plateAppearances: totalPlateAppearances,
          onBasePercentage: totalPlateAppearances > 0 ? (player.hits + gamePlayer.hits + player.walks + gamePlayer.walks + player.hitByPitch + gamePlayer.hitByPitch) / totalPlateAppearances : 0,
          sluggingPercentage: totalAtBats > 0 ? (player.hits + gamePlayer.hits - player.doubles - gamePlayer.doubles - player.triples - gamePlayer.triples - player.homeRuns - gamePlayer.homeRuns + 
            2 * (player.doubles + gamePlayer.doubles) + 3 * (player.triples + gamePlayer.triples) + 4 * (player.homeRuns + gamePlayer.homeRuns)) / totalAtBats : 0
        };
      });

      setCurrentGame(game + 1);
      setCurrentGameResult(gameResult);
    }

    currentSeasonResult.isComplete = true;
    setSeasonResult(currentSeasonResult);
    setIsSimulating(false);

    // シーズン結果を履歴に保存
    saveSeasonToHistory(currentSeasonResult);
  };

  const saveSeasonToHistory = (seasonResult: SeasonResult) => {
    const history = JSON.parse(localStorage.getItem('seasonHistory') || '[]');
    const newSeason = {
      ...seasonResult,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    history.unshift(newSeason); // 最新のシーズンを先頭に追加
    
    // 最新の5シーズンのみ保持
    const limitedHistory = history.slice(0, 5);
    localStorage.setItem('seasonHistory', JSON.stringify(limitedHistory));
  };

  const handleNewSeason = () => {
    router.push('/home');
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  if (isSimulating) {
    return (
      <Container size="lg" py="xl">
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="xl" align="center">
            <Center>
              <Loader size="xl" color="blue" />
            </Center>
            <Stack gap="md" align="center">
              <IconBallBaseball size={48} color="var(--mantine-color-blue-6)" />
              <Title order={2}>シーズンシミュレーション中...</Title>
              <Text c="dimmed" ta="center" size="lg">
                143試合をシミュレートしています
              </Text>
              <Progress 
                value={(currentGame / 143) * 100} 
                size="xl" 
                radius="xl" 
                color="blue" 
                style={{ width: '100%', maxWidth: '400px' }}
              />
              <Text size="sm" c="dimmed">
                {currentGame} / 143 試合完了
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (seasonResult) {
    return <SeasonScoreboard seasonResult={seasonResult} onNewSeason={handleNewSeason} onViewHistory={handleViewHistory} />;
  }

  return (
    <Container size="sm" py="xl">
      <Paper shadow="xs" p="xl" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Title order={2}>データが見つかりません</Title>
          <Text c="dimmed" ta="center">
            試合データが見つかりませんでした。新しい試合を開始してください。
          </Text>
          <Button onClick={handleNewSeason} color="blue" leftSection={<IconUserEdit size={16} />}>
            メンバー変更
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
} 