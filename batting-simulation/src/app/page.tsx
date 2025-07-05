'use client';

import { useState } from 'react';
import { Player, GameResult, GameStats } from '../types/baseball';
import { simulateInning } from '../utils/baseballSimulation';
import PlayerInputForm from '../components/PlayerInputForm';
import Scoreboard from '../components/Scoreboard';
import { Container, Stack, Text, Loader, Center, Paper, Title } from '@mantine/core';
import { IconBallBaseball } from '@tabler/icons-react';

export default function Home() {
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateGame = (homePlayers: Player[], awayPlayers: Player[]) => {
    setIsSimulating(true);
    
    // ゲーム結果の初期化
    const initialGameResult: GameResult = {
      homeTeam: {
        name: 'ホームチーム',
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
        name: 'アウェイチーム',
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

    // 9イニングをシミュレート
    for (let inning = 0; inning < 9; inning++) {
      // アウェイチームの攻撃（表）
      const awayInningResult = simulateInning(awayPlayers, true);
      currentGameResult.awayTeam.score += awayInningResult.runs;
      currentGameResult.innings.away[inning] = awayInningResult.runs;
      
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
      const homeInningResult = simulateInning(homePlayers, false);
      currentGameResult.homeTeam.score += homeInningResult.runs;
      currentGameResult.innings.home[inning] = homeInningResult.runs;
      
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
  };

  const handleNewGame = () => {
    setGameResult(null);
  };

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
                試合をシミュレートしています
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

  return <PlayerInputForm onPlayersSet={simulateGame} />;
}
