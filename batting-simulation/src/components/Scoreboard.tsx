'use client';

import { GameResult, Player, GameStats } from '../types/baseball';
import { calculateOPS } from '../utils/baseballSimulation';
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
  Divider,
  Alert,
} from '@mantine/core';
import { IconTrophy, IconRefresh, IconChartBar, IconUsers } from '@tabler/icons-react';

interface ScoreboardProps {
  gameResult: GameResult;
  onNewGame: () => void;
}

export default function Scoreboard({ gameResult, onNewGame }: ScoreboardProps) {
  const formatAverage = (hits: number, atBats: number): string => {
    if (atBats === 0) return '.000';
    return (hits / atBats).toFixed(3).replace('0.', '.');
  };

  const formatOPS = (player: Player & GameStats): string => {
    const ops = calculateOPS(player);
    return ops.toFixed(3);
  };

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
              <Table.Td fw={600}>{gameResult.awayTeam.name}</Table.Td>
              {gameResult.innings.away.map((score, index) => (
                <Table.Td key={index} ta="center">{score}</Table.Td>
              ))}
              <Table.Td ta="center" fw={700} c="blue">{gameResult.awayTeam.score}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td fw={600}>{gameResult.homeTeam.name}</Table.Td>
              {gameResult.innings.home.map((score, index) => (
                <Table.Td key={index} ta="center">{score}</Table.Td>
              ))}
              <Table.Td ta="center" fw={700} c="red">{gameResult.homeTeam.score}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );

  const getWinner = () => {
    if (gameResult.homeTeam.score > gameResult.awayTeam.score) {
      return gameResult.homeTeam.name;
    } else if (gameResult.awayTeam.score > gameResult.homeTeam.score) {
      return gameResult.awayTeam.name;
    } else {
      return '引き分け';
    }
  };

  const getWinnerColor = () => {
    if (gameResult.homeTeam.score > gameResult.awayTeam.score) {
      return 'red';
    } else if (gameResult.awayTeam.score > gameResult.homeTeam.score) {
      return 'blue';
    } else {
      return 'gray';
    }
  };

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
                  {gameResult.awayTeam.name} {gameResult.awayTeam.score} - {gameResult.homeTeam.score} {gameResult.homeTeam.name}
                </Title>
                <Group gap="sm">
                  <IconTrophy size={24} />
                  <Text size="xl" fw={700}>
                    勝者: {getWinner()}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Button
              size="lg"
              leftSection={<IconRefresh size={20} />}
              onClick={onNewGame}
              color="green"
            >
              新しい試合を開始
            </Button>
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
              {renderPlayerStats(gameResult.awayTeam.players, gameResult.awayTeam.name, 'blue')}
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              {renderPlayerStats(gameResult.homeTeam.players, gameResult.homeTeam.name, 'red')}
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
                    <Title order={4}>{gameResult.homeTeam.score + gameResult.awayTeam.score}</Title>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed">最多得点</Text>
                    <Title order={4}>{Math.max(gameResult.homeTeam.score, gameResult.awayTeam.score)}</Title>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed">最少得点</Text>
                    <Title order={4}>{Math.min(gameResult.homeTeam.score, gameResult.awayTeam.score)}</Title>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed">得点差</Text>
                    <Title order={4}>{Math.abs(gameResult.homeTeam.score - gameResult.awayTeam.score)}</Title>
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