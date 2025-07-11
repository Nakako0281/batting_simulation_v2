'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Player } from '../types/baseball';
import {
  Container,
  Title,
  Text,
  Card,
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Grid,
  Paper,
  Badge,
  Box,
  Center,
  Alert,
} from '@mantine/core';
import { IconBallBaseball, IconUsers, IconTrophy, IconInfoCircle } from '@tabler/icons-react';

interface PlayerInputFormProps {
  onPlayersSet: (homePlayers: Player[], awayPlayers: Player[]) => void;
}

// OPS 0.700程度の成績データ（実在選手を参考）
const getDefaultStats = (): { atBats: number; hits: number; doubles: number; triples: number; homeRuns: number; walks: number; hitByPitch: number; sacrificeFlies: number } => {
  return {
    atBats: 450,
    hits: 135,
    doubles: 25,
    triples: 3,
    homeRuns: 15,
    walks: 45,
    hitByPitch: 5,
    sacrificeFlies: 8
  };
};

export default function PlayerInputForm({ onPlayersSet }: PlayerInputFormProps) {
  const [homeTeamName, setHomeTeamName] = useState('ホームチーム');
  const [awayTeamName, setAwayTeamName] = useState('アウェイチーム');
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);

  const createDefaultPlayer = (team: 'home' | 'away', position: number): Player => {
    const defaultStats = getDefaultStats();
    return {
      id: `${team}-${position}`,
      name: `選手${position}`,
      team,
      position,
      ...defaultStats
    };
  };

  const initializePlayers = useCallback(() => {
    const home = Array.from({ length: 9 }, (_, i) => createDefaultPlayer('home', i + 1));
    const away = Array.from({ length: 9 }, (_, i) => createDefaultPlayer('away', i + 1));
    setHomePlayers(home);
    setAwayPlayers(away);
  }, []);

  // コンポーネントマウント時に選手を初期化
  useEffect(() => {
    initializePlayers();
  }, [initializePlayers]);

  const updatePlayer = (team: 'home' | 'away', position: number, field: keyof Player, value: string | number) => {
    const players = team === 'home' ? homePlayers : awayPlayers;
    const updatedPlayers = players.map(player =>
      player.position === position
        ? { ...player, [field]: value }
        : player
    );
    
    if (team === 'home') {
      setHomePlayers(updatedPlayers);
    } else {
      setAwayPlayers(updatedPlayers);
    }
  };

  const handleSubmit = () => {
    // 全選手の名前が入力されているかチェック
    const allHomePlayersFilled = homePlayers.every(p => p.name.trim() !== '');
    const allAwayPlayersFilled = awayPlayers.every(p => p.name.trim() !== '');
    
    if (!allHomePlayersFilled || !allAwayPlayersFilled) {
      alert('全選手の名前を入力してください');
      return;
    }
    
    onPlayersSet(homePlayers, awayPlayers);
  };

  const renderPlayerInputs = (players: Player[], team: 'home' | 'away') => (
    <Stack gap="lg">
      <Center>
        <Title order={3} c={team === 'home' ? 'blue' : 'red'}>
          {team === 'home' ? homeTeamName : awayTeamName}
        </Title>
      </Center>
      
      <Grid gutter="md">
        {players.map((player) => (
          <Grid.Col key={player.id} span={{ base: 12, sm: 6, lg: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Badge variant="light" color={team === 'home' ? 'blue' : 'red'}>
                    打順{player.position}
                  </Badge>
                  <IconUsers size={16} />
                </Group>
              </Card.Section>

              <Stack gap="sm" mt="md">
                <TextInput
                  label="選手名"
                  placeholder="選手名を入力"
                  value={player.name}
                  onChange={(e) => updatePlayer(team, player.position, 'name', e.target.value)}
                  required
                />
                
                <Group gap="xs" grow>
                  <NumberInput
                    label="打数"
                    placeholder="0"
                    value={player.atBats || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'atBats', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                  <NumberInput
                    label="安打"
                    placeholder="0"
                    value={player.hits || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'hits', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                </Group>

                <Group gap="xs" grow>
                  <NumberInput
                    label="2塁打"
                    placeholder="0"
                    value={player.doubles || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'doubles', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                  <NumberInput
                    label="3塁打"
                    placeholder="0"
                    value={player.triples || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'triples', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                </Group>

                <Group gap="xs" grow>
                  <NumberInput
                    label="本塁打"
                    placeholder="0"
                    value={player.homeRuns || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'homeRuns', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                  <NumberInput
                    label="四球"
                    placeholder="0"
                    value={player.walks || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'walks', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                </Group>

                <Group gap="xs" grow>
                  <NumberInput
                    label="死球"
                    placeholder="0"
                    value={player.hitByPitch || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'hitByPitch', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                  <NumberInput
                    label="犠飛"
                    placeholder="0"
                    value={player.sacrificeFlies || ''}
                    onChange={(value) => updatePlayer(team, player.position, 'sacrificeFlies', value || 0)}
                    min={0}
                    style={{ minWidth: '100px' }}
                  />
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md" align="center">
            <Group gap="sm">
              <IconBallBaseball size={32} color="var(--mantine-color-blue-6)" />
              <Title order={1}>野球シミュレーション</Title>
            </Group>
            <Text c="dimmed" ta="center" size="lg">
              選手の成績を入力してシミュレーションを開始してください
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              ※ 初期値としてOPS 0.700程度の成績が設定されています
            </Text>
            
            {/* ナビゲーションリンク */}
            <Group gap="md" mt="md">
              <Badge size="lg" variant="light" color="blue">
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  ホーム
                </Link>
              </Badge>
              <Badge size="lg" variant="light" color="gray">
                <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Group gap="xs">
                    <IconInfoCircle size={16} />
                    アプリについて
                  </Group>
                </Link>
              </Badge>
            </Group>
          </Stack>
        </Paper>
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Center>
            <Stack gap="md" align="center">
              <Alert
                title="入力確認"
                color="blue"
                variant="light"
                icon={<IconBallBaseball size={16} />}
              >
                全選手の名前が入力されていることを確認してください
              </Alert>
              <Button
                size="xl"
                leftSection={<IconTrophy size={24} />}
                onClick={handleSubmit}
                color="green"
              >
                試合開始
              </Button>
            </Stack>
          </Center>
        </Paper>
        {/* 選手入力フォーム */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              {renderPlayerInputs(homePlayers, 'home')}
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              {renderPlayerInputs(awayPlayers, 'away')}
            </Grid.Col>
          </Grid>
        </Paper>
        {/* チーム名入力 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">チーム設定</Title>
            <Group justify="center" gap="xl" wrap="nowrap">
              <TextInput
                label="ホームチーム名"
                placeholder="ホームチーム"
                value={homeTeamName}
                onChange={(e) => setHomeTeamName(e.target.value)}
                style={{ flex: 1 }}
              />
              <Box ta="center" pt={28}>
                <Badge size="lg" variant="light">
                  VS
                </Badge>
              </Box>
              <TextInput
                label="アウェイチーム名"
                placeholder="アウェイチーム"
                value={awayTeamName}
                onChange={(e) => setAwayTeamName(e.target.value)}
                style={{ flex: 1 }}
              />
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
} 