'use client';

import { useState, useEffect, useCallback } from 'react';
import { Player, GameResult, GameStats } from '../../types/baseball';
import { simulateInning } from '../../utils/baseballSimulation';
import Scoreboard from '../../components/Scoreboard';
import { Container, Stack, Text, Loader, Center, Paper, Title, Button, Group, Skeleton, Progress } from '@mantine/core';
import { IconBallBaseball, IconRefresh, IconUserEdit } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isResimulating, setIsResimulating] = useState(false);
  const [currentInning, setCurrentInning] = useState(0);

  useEffect(() => {
    // ローカルストレージから試合データを取得
    const gameData = localStorage.getItem('currentGame');
    if (!gameData) {
      // データがない場合はホームページにリダイレクト
      router.push('/home');
      return;
    }

    const { homePlayers, awayPlayers, homeTeamName, awayTeamName } = JSON.parse(gameData);
    simulateGame(homePlayers, awayPlayers, homeTeamName, awayTeamName);
  }, [router]);

  const simulateGame = (homePlayers: Player[], awayPlayers: Player[], homeTeamName: string, awayTeamName: string) => {
    setIsSimulating(true);
    setCurrentInning(0);
    
    // ゲーム結果の初期化
    const initialGameResult: GameResult = {
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

    let currentGameResult = { ...initialGameResult };
    
    // 打者順序を管理する変数
    let awayBatterIndex = 0;
    let homeBatterIndex = 0;

    // 9イニングをシミュレート
    for (let inning = 0; inning < 9; inning++) {
      setCurrentInning(inning + 1);
      
      // アウェイチームの攻撃（表）
      const awayInningResult = simulateInning(awayPlayers, true, awayBatterIndex);
      currentGameResult.awayTeam.score += awayInningResult.runs;
      currentGameResult.innings.away[inning] = awayInningResult.runs;
      awayBatterIndex = awayInningResult.nextBatterIndex;
      
      // アウェイチームの選手統計を更新
      currentGameResult.awayTeam.players = currentGameResult.awayTeam.players.map((player, index) => ({
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
      currentGameResult.homeTeam.score += homeInningResult.runs;
      currentGameResult.innings.home[inning] = homeInningResult.runs;
      homeBatterIndex = homeInningResult.nextBatterIndex;
      
      // ホームチームの選手統計を更新
      currentGameResult.homeTeam.players = currentGameResult.homeTeam.players.map((player, index) => ({
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

    currentGameResult.isComplete = true;
    setGameResult(currentGameResult);
    setIsSimulating(false);

    // 試合結果を履歴に保存
    saveGameToHistory(currentGameResult);
  };

  const handleResimulate = useCallback(() => {
    setIsResimulating(true);
    
    // ローカルストレージから元の選手データを取得
    const gameData = localStorage.getItem('currentGame');
    if (!gameData) {
      alert('元の選手データが見つかりません');
      setIsResimulating(false);
      return;
    }

    const { homePlayers, awayPlayers, homeTeamName, awayTeamName } = JSON.parse(gameData);
    simulateGame(homePlayers, awayPlayers, homeTeamName, awayTeamName);
    setIsResimulating(false);
  }, []);

  const saveGameToHistory = useCallback((gameResult: GameResult) => {
    const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    const newGame = {
      ...gameResult,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    history.unshift(newGame); // 最新の試合を先頭に追加
    
    // 最新の10試合のみ保持
    const limitedHistory = history.slice(0, 10);
    localStorage.setItem('gameHistory', JSON.stringify(limitedHistory));
  }, []);

  const handleNewGame = useCallback(() => {
    router.push('/home');
  }, [router]);

  if (isSimulating) {
    return (
      <Container size="sm" py="xl">
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="xl" align="center">
            <Center>
              <Loader size="xl" color="blue" />
            </Center>
            <Stack gap="md" align="center">
              <IconBallBaseball size={48} color="var(--mantine-color-blue-6)" />
              <Title order={2}>シミュレーション中...</Title>
              <Text c="dimmed" ta="center" size="lg">
                {currentInning}回目をシミュレートしています
              </Text>
              <Progress 
                value={(currentInning / 9) * 100} 
                size="xl" 
                radius="xl" 
                color="blue" 
                style={{ width: '100%', maxWidth: '400px' }}
              />
              <Text size="sm" c="dimmed">
                {currentInning} / 9 回完了
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (gameResult) {
    return <Scoreboard gameResult={gameResult} onNewGame={handleNewGame} />;
  }

  return (
    <Container size="sm" py="xl">
      <Paper shadow="xs" p="xl" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Title order={2}>データが見つかりません</Title>
          <Text c="dimmed" ta="center">
            試合データが見つかりませんでした。新しい試合を開始してください。
          </Text>
          <Group gap="md">
            <Button onClick={handleNewGame} color="blue" leftSection={<IconUserEdit size={16} />}>
              メンバー変更
            </Button>
            <Button onClick={handleResimulate} color="green" leftSection={<IconRefresh size={16} />} loading={isResimulating}>
              同じメンバーでもう一度
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
} 