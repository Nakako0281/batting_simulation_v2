'use client';

import { useState, useEffect } from 'react';
import { GameResult } from '../../types/baseball';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Card,
  Group,
  Badge,
  Button,
  Grid,
  Table,
  Center,
  Alert,
} from '@mantine/core';
import { IconBallBaseball, IconHistory, IconInfoCircle, IconHome, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface GameHistoryItem extends GameResult {
  id: string;
  timestamp: string;
}

interface SeasonHistoryItem {
  id: string;
  timestamp: string;
  homeTeam: {
    name: string;
    wins: number;
    losses: number;
    ties: number;
  };
  awayTeam: {
    name: string;
    wins: number;
    losses: number;
    ties: number;
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [seasonHistory, setSeasonHistory] = useState<SeasonHistoryItem[]>([]);

  useEffect(() => {
    // ローカルストレージから履歴を取得
    const gameHistoryData = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    const seasonHistoryData = JSON.parse(localStorage.getItem('seasonHistory') || '[]');
    setGameHistory(gameHistoryData);
    setSeasonHistory(seasonHistoryData);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWinner = (game: GameResult) => {
    if (game.homeTeam.score > game.awayTeam.score) {
      return game.homeTeam.name;
    } else if (game.awayTeam.score > game.homeTeam.score) {
      return game.awayTeam.name;
    } else {
      return '引き分け';
    }
  };

  const clearHistory = () => {
    if (confirm('すべての試合履歴を削除しますか？')) {
      localStorage.removeItem('gameHistory');
      localStorage.removeItem('seasonHistory');
      setGameHistory([]);
      setSeasonHistory([]);
    }
  };

  const clearAllData = () => {
    if (confirm('すべてのデータ（試合履歴、シーズン履歴、選手データ）を削除しますか？\nこの操作は取り消せません。')) {
      localStorage.removeItem('gameHistory');
      localStorage.removeItem('seasonHistory');
      localStorage.removeItem('playerData');
      localStorage.removeItem('currentGame');
      setGameHistory([]);
      setSeasonHistory([]);
    }
  };

  const viewGameDetails = (game: GameHistoryItem) => {
    // 試合詳細を表示する機能（将来的に実装可能）
    alert(`${game.awayTeam.name} ${game.awayTeam.score} - ${game.homeTeam.score} ${game.homeTeam.name}\n勝者: ${getWinner(game)}`);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md" align="center">
            <Group gap="sm">
              <IconHistory size={32} color="var(--mantine-color-blue-6)" />
              <Title order={1}>試合履歴</Title>
            </Group>
            <Text c="dimmed" ta="center" size="lg">
              過去の試合結果を確認できます
            </Text>
            
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
              <Badge size="lg" variant="light" color="blue">
                <a href="/history" style={{ textDecoration: 'none', color: 'inherit' }}>
                  試合履歴
                </a>
              </Badge>
            </Group>
          </Stack>
        </Paper>

        {/* 履歴がない場合 */}
        {gameHistory.length === 0 && seasonHistory.length === 0 ? (
          <Paper shadow="xs" p="xl" radius="md" withBorder>
            <Center>
              <Stack gap="md" align="center">
                <IconHistory size={48} color="var(--mantine-color-gray-4)" />
                <Title order={2}>履歴がありません</Title>
                <Text c="dimmed" ta="center">
                  まだ試合やシーズンを実行していません。新しい試合を開始して履歴を作成しましょう。
                </Text>
                <Button
                  size="lg"
                  leftSection={<IconBallBaseball size={20} />}
                  onClick={() => router.push('/home')}
                  color="blue"
                >
                  新しい試合を開始
                </Button>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <>
            {/* 統計サマリー */}
            <Paper shadow="xs" p="xl" radius="md" withBorder>
              <Stack gap="lg">
                <Title order={2} ta="center">履歴統計</Title>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card shadow="xs" padding="md" radius="md" withBorder>
                      <Stack gap="xs" align="center">
                        <Text size="sm" c="dimmed">総試合数</Text>
                        <Title order={4}>{gameHistory.length}</Title>
                      </Stack>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card shadow="xs" padding="md" radius="md" withBorder>
                      <Stack gap="xs" align="center">
                        <Text size="sm" c="dimmed">シーズン数</Text>
                        <Title order={4}>{seasonHistory.length}</Title>
                      </Stack>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card shadow="xs" padding="md" radius="md" withBorder>
                      <Stack gap="xs" align="center">
                        <Text size="sm" c="dimmed">最多得点試合</Text>
                        <Title order={4}>
                          {gameHistory.length > 0 ? Math.max(...gameHistory.map(g => g.homeTeam.score + g.awayTeam.score)) : 0}
                        </Title>
                      </Stack>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card shadow="xs" padding="md" radius="md" withBorder>
                      <Stack gap="xs" align="center">
                        <Text size="sm" c="dimmed">平均得点</Text>
                        <Title order={4}>
                          {gameHistory.length > 0 ? (gameHistory.reduce((sum, g) => sum + g.homeTeam.score + g.awayTeam.score, 0) / gameHistory.length).toFixed(1) : '0.0'}
                        </Title>
                      </Stack>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Paper>

            {/* 履歴一覧 */}
            <Paper shadow="xs" p="xl" radius="md" withBorder>
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <Title order={2}>試合一覧</Title>
                  <Group gap="md">
                    <Button
                      variant="light"
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={clearHistory}
                    >
                      履歴をクリア
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={clearAllData}
                    >
                      全データをクリア
                    </Button>
                  </Group>
                </Group>

                <Table striped highlightOnHover withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>日時</Table.Th>
                      <Table.Th ta="center">アウェイチーム</Table.Th>
                      <Table.Th ta="center">スコア</Table.Th>
                      <Table.Th ta="center">ホームチーム</Table.Th>
                      <Table.Th ta="center">勝者</Table.Th>
                      <Table.Th ta="center">操作</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {gameHistory.map((game) => (
                      <Table.Tr key={game.id}>
                        <Table.Td>{formatDate(game.timestamp)}</Table.Td>
                        <Table.Td ta="center" fw={500}>{game.awayTeam.name}</Table.Td>
                        <Table.Td ta="center" fw={700}>
                          {game.awayTeam.score} - {game.homeTeam.score}
                        </Table.Td>
                        <Table.Td ta="center" fw={500}>{game.homeTeam.name}</Table.Td>
                        <Table.Td ta="center">
                          <Badge 
                            color={getWinner(game) === game.homeTeam.name ? 'red' : 
                                   getWinner(game) === game.awayTeam.name ? 'blue' : 'gray'}
                            variant="light"
                          >
                            {getWinner(game)}
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => viewGameDetails(game)}
                          >
                            詳細
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Paper>

            {/* シーズン履歴がある場合 */}
            {seasonHistory.length > 0 && (
              <Paper shadow="xs" p="xl" radius="md" withBorder>
                <Stack gap="lg">
                  <Title order={2}>シーズン履歴</Title>
                  <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>日時</Table.Th>
                        <Table.Th ta="center">ホームチーム</Table.Th>
                        <Table.Th ta="center">成績</Table.Th>
                        <Table.Th ta="center">アウェイチーム</Table.Th>
                        <Table.Th ta="center">成績</Table.Th>
                        <Table.Th ta="center">優勝</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {seasonHistory.map((season) => {
                        const homeWinRate = (season.homeTeam.wins / 143) * 100;
                        const awayWinRate = (season.awayTeam.wins / 143) * 100;
                        const winner = homeWinRate > awayWinRate ? season.homeTeam.name : 
                                     awayWinRate > homeWinRate ? season.awayTeam.name : '引き分け';
                        const winnerColor = homeWinRate > awayWinRate ? 'red' : 
                                          awayWinRate > homeWinRate ? 'blue' : 'gray';
                        
                        return (
                          <Table.Tr key={season.id}>
                            <Table.Td>{formatDate(season.timestamp)}</Table.Td>
                            <Table.Td ta="center" fw={500}>{season.homeTeam.name}</Table.Td>
                            <Table.Td ta="center">
                              {season.homeTeam.wins}勝{season.homeTeam.losses}敗{season.homeTeam.ties}分
                              <br />
                              <Text size="sm" c="dimmed">
                                ({homeWinRate.toFixed(1)}%)
                              </Text>
                            </Table.Td>
                            <Table.Td ta="center" fw={500}>{season.awayTeam.name}</Table.Td>
                            <Table.Td ta="center">
                              {season.awayTeam.wins}勝{season.awayTeam.losses}敗{season.awayTeam.ties}分
                              <br />
                              <Text size="sm" c="dimmed">
                                ({awayWinRate.toFixed(1)}%)
                              </Text>
                            </Table.Td>
                            <Table.Td ta="center">
                              <Badge color={winnerColor} variant="light">
                                {winner}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Paper>
            )}

            {/* 注意事項 */}
            <Alert
              title="履歴について"
              color="blue"
              variant="light"
              icon={<IconInfoCircle size={16} />}
            >
              試合履歴とシーズン履歴はブラウザのローカルストレージに保存されています。
              ブラウザのデータを削除すると履歴も失われます。
              最新の10試合と5シーズンのみが保存されます。
            </Alert>
          </>
        )}
      </Stack>
    </Container>
  );
} 