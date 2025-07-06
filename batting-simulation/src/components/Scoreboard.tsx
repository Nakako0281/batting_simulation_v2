'use client';

import { GameResult, Player, GameStats } from '../types/baseball';
import { calculateOPS } from '../utils/baseballSimulation';
import { simulateInning } from '../utils/baseballSimulation';
import {
  Container,
  Title,
  Text,
  Card,
  Button,
  Group,
  Stack,
  Paper,
  Table,
  Badge,
  Box,
  Center,
  Grid,
  Loader,
  Progress,
} from '@mantine/core';
import { IconTrophy, IconRefresh, IconChartBar, IconUsers, IconHome, IconHistory, IconInfoCircle, IconUserEdit } from '@tabler/icons-react';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ScoreboardProps {
  gameResult: GameResult;
}

export default function Scoreboard({ gameResult }: ScoreboardProps) {
  const router = useRouter();
  const [isResimulating, setIsResimulating] = useState(false);
  const [currentGameResult, setCurrentGameResult] = useState<GameResult>(gameResult);

  const formatAverage = useCallback((hits: number, atBats: number): string => {
    if (atBats === 0) return '.000';
    return (hits / atBats).toFixed(3).replace('0.', '.');
  }, []);

  const formatOPS = useCallback((player: Player & GameStats): string => {
    const ops = calculateOPS(player);
    return ops.toFixed(3);
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
    
    // ゲーム結果の初期化
    const initialGameResult: GameResult = {
      homeTeam: {
        name: homeTeamName,
        score: 0,
        players: homePlayers.map((player: Player) => ({
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
        players: awayPlayers.map((player: Player) => ({
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

    const newGameResult = { ...initialGameResult };
    
    // 打者順序を管理する変数
    let awayBatterIndex = 0;
    let homeBatterIndex = 0;

    // 9イニングをシミュレート
    for (let inning = 0; inning < 9; inning++) {
      // アウェイチームの攻撃（表）
      const awayInningResult = simulateInning(awayPlayers, true, awayBatterIndex);
      newGameResult.awayTeam.score += awayInningResult.runs;
      newGameResult.innings.away[inning] = awayInningResult.runs;
      awayBatterIndex = awayInningResult.nextBatterIndex;
      
      // アウェイチームの選手統計を更新
      newGameResult.awayTeam.players = newGameResult.awayTeam.players.map((player, index) => ({
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
      newGameResult.homeTeam.score += homeInningResult.runs;
      newGameResult.innings.home[inning] = homeInningResult.runs;
      homeBatterIndex = homeInningResult.nextBatterIndex;
      
      // ホームチームの選手統計を更新
      newGameResult.homeTeam.players = newGameResult.homeTeam.players.map((player, index) => ({
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

    newGameResult.isComplete = true;
    setCurrentGameResult(newGameResult);
    setIsResimulating(false);

    // 試合結果を履歴に保存
    saveGameToHistory(newGameResult);
  }, [saveGameToHistory]);

  const handleChangeMembers = useCallback(() => {
    router.push('/home');
  }, [router]);

  const renderPlayerStats = (players: (Player & GameStats)[], teamName: string, teamColor: string) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Title order={3} c={teamColor}>{teamName}</Title>
          <IconUsers size={20} />
        </Group>
      </Card.Section>

      <Box mt="md">
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>選手名</Table.Th>
              <Table.Th ta="center">打数</Table.Th>
              <Table.Th ta="center">安打</Table.Th>
              <Table.Th ta="center">打率</Table.Th>
              <Table.Th ta="center">2塁打</Table.Th>
              <Table.Th ta="center">3塁打</Table.Th>
              <Table.Th ta="center">本塁打</Table.Th>
              <Table.Th ta="center">四球</Table.Th>
              <Table.Th ta="center">死球</Table.Th>
              <Table.Th ta="center">犠飛</Table.Th>
              <Table.Th ta="center">打点</Table.Th>
              <Table.Th ta="center">OPS</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {players.map((player) => (
              <Table.Tr key={player.id}>
                <Table.Td fw={500}>{player.name}</Table.Td>
                <Table.Td ta="center">{player.atBats}</Table.Td>
                <Table.Td ta="center">{player.hits}</Table.Td>
                <Table.Td ta="center" fw={600}>{formatAverage(player.hits, player.atBats)}</Table.Td>
                <Table.Td ta="center">{player.doubles}</Table.Td>
                <Table.Td ta="center">{player.triples}</Table.Td>
                <Table.Td ta="center">{player.homeRuns}</Table.Td>
                <Table.Td ta="center">{player.walks}</Table.Td>
                <Table.Td ta="center">{player.hitByPitch}</Table.Td>
                <Table.Td ta="center">{player.sacrificeFlies}</Table.Td>
                <Table.Td ta="center" fw={600}>{player.rbis}</Table.Td>
                <Table.Td ta="center" fw={600}>{formatOPS(player)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );

  const renderInningScore = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Title order={3}>イニング別スコア</Title>
          <IconChartBar size={20} />
        </Group>
      </Card.Section>

      <Box mt="md">
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta="center">チーム</Table.Th>
              {Array.from({ length: 9 }, (_, i) => (
                <Table.Th key={i + 1} ta="center">{i + 1}</Table.Th>
              ))}
              <Table.Th ta="center" fw={700}>合計</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td fw={600}>{currentGameResult.awayTeam.name}</Table.Td>
              {currentGameResult.innings.away.map((score, index) => (
                <Table.Td key={index} ta="center">{score}</Table.Td>
              ))}
              <Table.Td ta="center" fw={700} c="blue">{currentGameResult.awayTeam.score}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td fw={600}>{currentGameResult.homeTeam.name}</Table.Td>
              {currentGameResult.innings.home.map((score, index) => (
                <Table.Td key={index} ta="center">{score}</Table.Td>
              ))}
              <Table.Td ta="center" fw={700} c="red">{currentGameResult.homeTeam.score}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );

  const getWinner = useMemo(() => {
    if (currentGameResult.homeTeam.score > currentGameResult.awayTeam.score) {
      return currentGameResult.homeTeam.name;
    } else if (currentGameResult.awayTeam.score > currentGameResult.homeTeam.score) {
      return currentGameResult.awayTeam.name;
    } else {
      return '引き分け';
    }
  }, [currentGameResult.homeTeam.score, currentGameResult.awayTeam.score, currentGameResult.homeTeam.name, currentGameResult.awayTeam.name]);

  if (isResimulating) {
    return (
      <Container size="sm" py="xl">
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="xl" align="center">
            <Center>
              <Loader size="xl" color="blue" />
            </Center>
            <Stack gap="md" align="center">
              <IconTrophy size={48} color="var(--mantine-color-blue-6)" />
              <Title order={2}>再シミュレーション中...</Title>
              <Text c="dimmed" ta="center" size="lg">
                同じメンバーで再度シミュレートしています
              </Text>
              <Progress 
                value={50} 
                size="xl" 
                radius="xl" 
                color="blue" 
                style={{ width: '100%', maxWidth: '400px' }}
                animated
              />
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md" align="center">
            <Title order={1}>試合結果</Title>
            
            {/* 最終スコア */}
            <Card 
              shadow="md" 
              padding="xl" 
              radius="lg" 
              withBorder
              style={{
                background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-red-6) 100%)',
                color: 'white'
              }}
            >
              <Stack gap="md" align="center">
                <Title order={2} c="white">
                  {currentGameResult.awayTeam.name} {currentGameResult.awayTeam.score} - {currentGameResult.homeTeam.score} {currentGameResult.homeTeam.name}
                </Title>
                <Group gap="sm">
                  <IconTrophy size={24} />
                                  <Text size="xl" fw={700}>
                  勝者: {getWinner}
                </Text>
                </Group>
              </Stack>
            </Card>

            {/* ナビゲーションリンク */}
            <Group gap="md" mt="md">
              <Badge size="lg" variant="light" color="gray">
                <a href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Group gap="xs">
                    <IconHome size={16} />
                    ホーム
                  </Group>
                </a>
              </Badge>
              <Badge size="lg" variant="light" color="gray">
                <a href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Group gap="xs">
                    <IconInfoCircle size={16} />
                    アプリについて
                  </Group>
                </a>
              </Badge>
              <Badge size="lg" variant="light" color="gray">
                <a href="/history" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Group gap="xs">
                    <IconHistory size={16} />
                    試合履歴
                  </Group>
                </a>
              </Badge>
            </Group>

            {/* ボタングループ */}
            <Group gap="md" mt="md">
              <Button
                size="lg"
                leftSection={<IconUserEdit size={20} />}
                onClick={handleChangeMembers}
                color="blue"
              >
                メンバー変更
              </Button>
              <Button
                size="lg"
                leftSection={<IconRefresh size={20} />}
                onClick={handleResimulate}
                color="green"
                loading={isResimulating}
              >
                同じメンバーでもう一度
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* イニング別スコア */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          {renderInningScore()}
        </Paper>

        {/* 選手成績 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              {renderPlayerStats(currentGameResult.awayTeam.players, currentGameResult.awayTeam.name, 'blue')}
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              {renderPlayerStats(currentGameResult.homeTeam.players, currentGameResult.homeTeam.name, 'red')}
            </Grid.Col>
          </Grid>
        </Paper>

        {/* 統計サマリー */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} ta="center">試合統計サマリー</Title>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed">総得点</Text>
                    <Title order={4}>{currentGameResult.homeTeam.score + currentGameResult.awayTeam.score}</Title>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed">最多得点</Text>
                    <Title order={4}>{Math.max(currentGameResult.homeTeam.score, currentGameResult.awayTeam.score)}</Title>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed">最少得点</Text>
                    <Title order={4}>{Math.min(currentGameResult.homeTeam.score, currentGameResult.awayTeam.score)}</Title>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed">得点差</Text>
                    <Title order={4}>{Math.abs(currentGameResult.homeTeam.score - currentGameResult.awayTeam.score)}</Title>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
} 