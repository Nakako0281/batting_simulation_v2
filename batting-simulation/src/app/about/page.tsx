'use client';

import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Badge,
  List,
  Alert,
  Card,
  Grid,
} from '@mantine/core';
import { IconBallBaseball, IconInfoCircle, IconHome, IconHistory, IconCalculator, IconUsers, IconTrophy } from '@tabler/icons-react';

export default function AboutPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md" align="center">
            <Group gap="sm">
              <IconInfoCircle size={32} color="var(--mantine-color-blue-6)" />
              <Title order={1}>アプリについて</Title>
            </Group>
            <Text c="dimmed" ta="center" size="lg">
              野球打撃成績シミュレーションアプリの詳細情報
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
              <Badge size="lg" variant="light" color="blue">
                <a href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                  アプリについて
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
          </Stack>
        </Paper>

        {/* アプリ概要 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>アプリ概要</Title>
            <Text size="lg">
              このアプリは、野球の打撃成績データを基に9回までの試合をシミュレートし、
              リアルな野球の試合結果を予測するWebアプリケーションです。
            </Text>
            
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md" align="center">
                    <IconUsers size={32} color="var(--mantine-color-blue-6)" />
                    <Title order={4}>選手データ入力</Title>
                    <Text size="sm" ta="center" c="dimmed">
                      各チーム9名の選手の打撃成績を入力できます
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md" align="center">
                    <IconCalculator size={32} color="var(--mantine-color-green-6)" />
                    <Title order={4}>OPS計算</Title>
                    <Text size="sm" ta="center" c="dimmed">
                      OPS（出塁率+長打率）を基にシミュレーションを実行
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md" align="center">
                    <IconTrophy size={32} color="var(--mantine-color-yellow-6)" />
                    <Title order={4}>結果表示</Title>
                    <Text size="sm" ta="center" c="dimmed">
                      詳細なスコアボードと選手成績を表示
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* 機能詳細 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>主な機能</Title>
            
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Stack gap="md">
                  <Title order={3}>選手データ管理</Title>
                  <List spacing="sm">
                    <List.Item>各選手の打数、安打、2塁打、3塁打、本塁打を入力</List.Item>
                    <List.Item>四球、死球、犠飛のデータも含む</List.Item>
                    <List.Item>OPS 0.700程度の初期値が設定済み</List.Item>
                    <List.Item>チーム名のカスタマイズ可能</List.Item>
                  </List>
                </Stack>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Stack gap="md">
                  <Title order={3}>シミュレーション機能</Title>
                  <List spacing="sm">
                    <List.Item>9回までの完全試合をシミュレート</List.Item>
                    <List.Item>OPSに基づく確率的な結果計算</List.Item>
                    <List.Item>イニング別の得点表示</List.Item>
                    <List.Item>リアルタイムでの選手成績更新</List.Item>
                  </List>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* 技術仕様 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>技術仕様</Title>
            
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Stack gap="md">
                  <Title order={3}>フロントエンド</Title>
                  <List spacing="sm">
                    <List.Item>Next.js 14 (App Router)</List.Item>
                    <List.Item>TypeScript</List.Item>
                    <List.Item>Mantine UI (コンポーネントライブラリ)</List.Item>
                    <List.Item>Tailwind CSS (スタイリング)</List.Item>
                  </List>
                </Stack>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Stack gap="md">
                  <Title order={3}>データ管理</Title>
                  <List spacing="sm">
                    <List.Item>ローカルストレージでのデータ保存</List.Item>
                    <List.Item>試合履歴の自動保存</List.Item>
                    <List.Item>最新10試合の履歴保持</List.Item>
                    <List.Item>リアルタイムデータ更新</List.Item>
                  </List>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* OPS計算について */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>OPS計算について</Title>
            <Text>
              OPS（On-base Plus Slugging）は、出塁率と長打率を足し合わせた指標で、
              打者の総合的な攻撃力を表します。
            </Text>
            
            <Alert
              title="計算式"
              color="blue"
              variant="light"
              icon={<IconCalculator size={16} />}
            >
              <Text size="sm">
                <strong>出塁率 = (安打 + 四球 + 死球) ÷ (打数 + 四球 + 死球 + 犠飛)</strong><br />
                <strong>長打率 = (安打 + 2塁打 + 2×3塁打 + 3×本塁打) ÷ 打数</strong><br />
                <strong>OPS = 出塁率 + 長打率</strong>
              </Text>
            </Alert>
            
            <Text size="sm" c="dimmed">
              ※ このアプリでは、OPSの値に基づいて打席結果の確率を計算し、
              リアルな野球の試合結果をシミュレートしています。
            </Text>
          </Stack>
        </Paper>

        {/* 注意事項 */}
        <Alert
          title="ご利用上の注意"
          color="yellow"
          variant="light"
          icon={<IconInfoCircle size={16} />}
        >
          <Text size="sm">
            ・このアプリはシミュレーションであり、実際の野球の結果を保証するものではありません。<br />
            ・データはブラウザのローカルストレージに保存されます。<br />
            ・ブラウザのデータを削除すると履歴も失われます。<br />
            ・最新の10試合のみが履歴に保存されます。
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
} 