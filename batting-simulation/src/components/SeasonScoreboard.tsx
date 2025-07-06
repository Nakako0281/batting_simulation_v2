'use client';

import { useMemo, useCallback } from 'react';
import { Player, GameStats } from '../types/baseball';
import {
  Container,
  Stack,
  Title,
  Text,
  Card,
  Group,
  Button,
  Table,
  Box,
  Paper,
  Grid,
  Alert,
} from '@mantine/core';
import {
  IconTrophy,
  IconUsers,
  IconChartBar,
  IconUserEdit,
  IconHistory,
  IconBallBaseball,
} from '@tabler/icons-react';


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
  games: unknown[];
  isComplete: boolean;
}

interface SeasonScoreboardProps {
  seasonResult: SeasonResult;
  onNewSeason: () => void;
  onViewHistory: () => void;
}

export default function SeasonScoreboard({ seasonResult, onNewSeason, onViewHistory }: SeasonScoreboardProps) {

  const formatAverage = useCallback((hits: number, atBats: number): string => {
    if (atBats === 0) return '.000';
    return (hits / atBats).toFixed(3).replace('0.', '.');
  }, []);

  const formatOPS = useCallback((player: Player & SeasonStats): string => {
    const ops = player.onBasePercentage + player.sluggingPercentage;
    return ops.toFixed(3);
  }, []);

  const formatPercentage = useCallback((value: number): string => {
    return (value * 100).toFixed(3).replace('0.', '.');
  }, []);

  const getWinner = useMemo(() => {
    const homeWinRate = seasonResult.homeTeam.wins / 143;
    const awayWinRate = seasonResult.awayTeam.wins / 143;
    
    if (homeWinRate > awayWinRate) {
      return seasonResult.homeTeam.name;
    } else if (awayWinRate > homeWinRate) {
      return seasonResult.awayTeam.name;
    } else {
      return '引き分け';
    }
  }, [seasonResult.homeTeam.wins, seasonResult.awayTeam.wins, seasonResult.homeTeam.name, seasonResult.awayTeam.name]);

  const getWinnerColor = useMemo(() => {
    const homeWinRate = seasonResult.homeTeam.wins / 143;
    const awayWinRate = seasonResult.awayTeam.wins / 143;
    
    if (homeWinRate > awayWinRate) {
      return 'red';
    } else if (awayWinRate > homeWinRate) {
      return 'blue';
    } else {
      return 'gray';
    }
  }, [seasonResult.homeTeam.wins, seasonResult.awayTeam.wins]);

  const renderSeasonStandings = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Title order={3}>シーズン成績</Title>
          <IconTrophy size={20} />
        </Group>
      </Card.Section>

      <Box mt="md">
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>チーム</Table.Th>
              <Table.Th ta="center">試合数</Table.Th>
              <Table.Th ta="center">勝利</Table.Th>
              <Table.Th ta="center">敗戦</Table.Th>
              <Table.Th ta="center">引き分け</Table.Th>
              <Table.Th ta="center">勝率</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td fw={600}>{seasonResult.homeTeam.name}</Table.Td>
              <Table.Td ta="center">143</Table.Td>
              <Table.Td ta="center" c="green">{seasonResult.homeTeam.wins}</Table.Td>
              <Table.Td ta="center" c="red">{seasonResult.homeTeam.losses}</Table.Td>
              <Table.Td ta="center">{seasonResult.homeTeam.ties}</Table.Td>
              <Table.Td ta="center" fw={600}>
                {((seasonResult.homeTeam.wins / 143) * 100).toFixed(1)}%
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td fw={600}>{seasonResult.awayTeam.name}</Table.Td>
              <Table.Td ta="center">143</Table.Td>
              <Table.Td ta="center" c="green">{seasonResult.awayTeam.wins}</Table.Td>
              <Table.Td ta="center" c="red">{seasonResult.awayTeam.losses}</Table.Td>
              <Table.Td ta="center">{seasonResult.awayTeam.ties}</Table.Td>
              <Table.Td ta="center" fw={600}>
                {((seasonResult.awayTeam.wins / 143) * 100).toFixed(1)}%
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>

      <Box mt="lg">
                  <Alert
            title="シーズン結果"
            color={getWinnerColor}
            variant="light"
            icon={<IconTrophy size={16} />}
          >
            <Text fw={600} size="lg">
              優勝: {getWinner}
            </Text>
          </Alert>
      </Box>
    </Card>
  );

  const renderPlayerStats = (players: (Player & SeasonStats)[], teamName: string, teamColor: string) => (
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
              <Table.Th ta="center">試合数</Table.Th>
              <Table.Th ta="center">打数</Table.Th>
              <Table.Th ta="center">安打</Table.Th>
              <Table.Th ta="center">打率</Table.Th>
              <Table.Th ta="center">出塁率</Table.Th>
              <Table.Th ta="center">長打率</Table.Th>
              <Table.Th ta="center">OPS</Table.Th>
              <Table.Th ta="center">本塁打</Table.Th>
              <Table.Th ta="center">打点</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {players.map((player) => (
              <Table.Tr key={player.id}>
                <Table.Td fw={500}>{player.name}</Table.Td>
                <Table.Td ta="center">{player.games}</Table.Td>
                <Table.Td ta="center">{player.atBats}</Table.Td>
                <Table.Td ta="center">{player.hits}</Table.Td>
                <Table.Td ta="center" fw={600}>{formatAverage(player.hits, player.atBats)}</Table.Td>
                <Table.Td ta="center" fw={600}>{formatPercentage(player.onBasePercentage)}</Table.Td>
                <Table.Td ta="center" fw={600}>{formatPercentage(player.sluggingPercentage)}</Table.Td>
                <Table.Td ta="center" fw={600}>{formatOPS(player)}</Table.Td>
                <Table.Td ta="center">{player.homeRuns}</Table.Td>
                <Table.Td ta="center" fw={600}>{player.rbis}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );

  const renderDetailedStats = (players: (Player & SeasonStats)[], teamName: string, teamColor: string) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Title order={3} c={teamColor}>{teamName} 詳細統計</Title>
          <IconChartBar size={20} />
        </Group>
      </Card.Section>

      <Box mt="md">
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>選手名</Table.Th>
              <Table.Th ta="center">2塁打</Table.Th>
              <Table.Th ta="center">3塁打</Table.Th>
              <Table.Th ta="center">四球</Table.Th>
              <Table.Th ta="center">死球</Table.Th>
              <Table.Th ta="center">犠飛</Table.Th>
              <Table.Th ta="center">得点</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {players.map((player) => (
              <Table.Tr key={player.id}>
                <Table.Td fw={500}>{player.name}</Table.Td>
                <Table.Td ta="center">{player.doubles}</Table.Td>
                <Table.Td ta="center">{player.triples}</Table.Td>
                <Table.Td ta="center">{player.walks}</Table.Td>
                <Table.Td ta="center">{player.hitByPitch}</Table.Td>
                <Table.Td ta="center">{player.sacrificeFlies}</Table.Td>
                <Table.Td ta="center">{player.runs}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md" align="center">
            <Group gap="md" align="center">
              <IconBallBaseball size={48} color="var(--mantine-color-blue-6)" />
              <Title order={1}>NPB シーズンシミュレーション結果</Title>
            </Group>
            <Text c="dimmed" ta="center" size="lg">
              143試合のシーズン結果
            </Text>
            <Group gap="md">
              <Button
                onClick={onNewSeason}
                color="blue"
                leftSection={<IconUserEdit size={16} />}
                size="lg"
              >
                新しいシーズン
              </Button>
              <Button
                onClick={onViewHistory}
                color="gray"
                leftSection={<IconHistory size={16} />}
                size="lg"
              >
                履歴を見る
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* シーズン成績 */}
        {renderSeasonStandings()}

        {/* 選手統計 */}
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            {renderPlayerStats(seasonResult.homeTeam.players, seasonResult.homeTeam.name, 'red')}
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            {renderPlayerStats(seasonResult.awayTeam.players, seasonResult.awayTeam.name, 'blue')}
          </Grid.Col>
        </Grid>

        {/* 詳細統計 */}
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            {renderDetailedStats(seasonResult.homeTeam.players, seasonResult.homeTeam.name, 'red')}
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            {renderDetailedStats(seasonResult.awayTeam.players, seasonResult.awayTeam.name, 'blue')}
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
} 