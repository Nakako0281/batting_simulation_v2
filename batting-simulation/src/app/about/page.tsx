'use client';

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
  Table,
  Box,
  Center,
  Alert,
  Code,
  List,
  Grid,
} from '@mantine/core';
import {
  IconBallBaseball,
  IconHistory,
  IconInfoCircle,
  IconHome,
  IconCalculator,
  IconChartBar,
  IconTarget,
  IconTrendingUp,
  IconMath,
  IconBrain,
  IconUsers,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md" align="center">
            <Group gap="sm">
              <IconCalculator size={32} color="var(--mantine-color-blue-6)" />
              <Title order={1}>シミュレーション計算メソッド</Title>
            </Group>
            <Text c="dimmed" ta="center" size="lg">
              野球シミュレーションで使用される計算方法の詳細解説
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
          </Stack>
        </Paper>

        {/* 概要 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">
              <Group gap="sm" justify="center">
                <IconBrain size={24} />
                シミュレーション概要
              </Group>
            </Title>
            <Text size="lg" ta="center">
              このアプリケーションは、選手の過去の成績データを基に、野球の試合を確率的にシミュレートします。
              各打席での結果は、選手のOPS（出塁率 + 長打率）を基準とした確率計算によって決定されます。
            </Text>
          </Stack>
        </Paper>

        {/* OPS計算 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">
              <Group gap="sm" justify="center">
                <IconMath size={24} />
                OPS（出塁率 + 長打率）の計算
              </Group>
            </Title>
            
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Title order={3}>出塁率（OBP）の計算</Title>
                  <IconTarget size={20} />
                </Group>
              </Card.Section>
              <Box mt="md">
                <Text size="lg" fw={600}>公式:</Text>
                <Code block>
                  OBP = (安打 + 四球 + 死球) / (打数 + 四球 + 死球 + 犠飛)
                </Code>
                <Text mt="md">
                  出塁率は、打者が塁に出る確率を示します。安打、四球、死球の合計を、打席数（打数 + 四球 + 死球 + 犠飛）で割って計算されます。
                </Text>
              </Box>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Title order={3}>長打率（SLG）の計算</Title>
                  <IconTrendingUp size={20} />
                </Group>
              </Card.Section>
              <Box mt="md">
                <Text size="lg" fw={600}>公式:</Text>
                <Code block>
                  SLG = (単打 + 2×2塁打 + 3×3塁打 + 4×本塁打) / 打数
                </Code>
                <Text mt="md">
                  長打率は、打者の長打能力を示します。各安打の種類に応じた得点価値を掛けて合計し、打数で割って計算されます。
                </Text>
              </Box>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Title order={3}>OPSの計算</Title>
                  <IconCalculator size={20} />
                </Group>
              </Card.Section>
              <Box mt="md">
                <Text size="lg" fw={600}>公式:</Text>
                <Code block>
                  OPS = 出塁率（OBP）+ 長打率（SLG）
                </Code>
                <Text mt="md">
                  OPSは、打者の総合的な攻撃力を示す指標です。出塁率と長打率を足し合わせることで、打者の価値を総合的に評価できます。
                </Text>
              </Box>
            </Card>
          </Stack>
        </Paper>

        {/* 打撃結果の確率計算 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">
              <Group gap="sm" justify="center">
                <IconTarget size={24} />
                打撃結果の確率計算
              </Group>
            </Title>
            
            <Text size="lg">
              各打席での結果は、選手のOPSを基に以下の確率で決定されます：
            </Text>

            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>結果</Table.Th>
                  <Table.Th>確率計算</Table.Th>
                  <Table.Th>説明</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td fw={600}>四球</Table.Td>
                  <Table.Td>
                    <Code>Math.min(0.15, OPS × 0.1)</Code>
                  </Table.Td>
                  <Table.Td>OPSに基づいて四球率を計算（最大15%）</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>死球</Table.Td>
                  <Table.Td>
                    <Code>0.02</Code>
                  </Table.Td>
                  <Table.Td>固定で2%の確率</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>安打</Table.Td>
                  <Table.Td>
                    <Code>Math.min(0.4, OPS × 0.3)</Code>
                  </Table.Td>
                  <Table.Td>OPSに基づいて安打率を計算（最大40%）</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>犠飛</Table.Td>
                  <Table.Td>
                    <Code>0.05</Code>
                  </Table.Td>
                  <Table.Td>固定で5%の確率</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>アウト</Table.Td>
                  <Table.Td>
                    <Code>残りの確率</Code>
                  </Table.Td>
                  <Table.Td>上記以外の結果</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Alert
              title="安打の種類の決定"
              color="blue"
              variant="light"
              icon={<IconBallBaseball size={16} />}
            >
              <Text>
                安打が出た場合、選手の過去の成績に基づいて安打の種類が決定されます：
              </Text>
              <List mt="md">
                <List.Item>
                  <Text fw={600}>単打率:</Text>
                  <Text>単打数 ÷ 総安打数</Text>
                </List.Item>
                <List.Item>
                  <Text fw={600}>2塁打率:</Text>
                  <Text>2塁打数 ÷ 総安打数</Text>
                </List.Item>
                <List.Item>
                  <Text fw={600}>3塁打率:</Text>
                  <Text>3塁打数 ÷ 総安打数</Text>
                </List.Item>
                <List.Item>
                  <Text fw={600}>本塁打率:</Text>
                  <Text>本塁打数 ÷ 総安打数</Text>
                </List.Item>
              </List>
              <Text mt="md" size="sm" c="dimmed">
                ※ 安打がない選手の場合は、デフォルト確率（単打70%、2塁打15%、3塁打10%、本塁打5%）を使用
              </Text>
            </Alert>
          </Stack>
        </Paper>

        {/* 得点計算 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">
              <Group gap="sm" justify="center">
                <IconTrendingUp size={24} />
                得点計算ロジック
              </Group>
            </Title>
            
            <Text size="lg">
              各打撃結果に応じて、塁上のランナーと得点が以下のように処理されます：
            </Text>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>四球・死球</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Text>• 1塁が空いていれば1塁に進塁</Text>
                    <Text>• 1塁にランナーがいれば、順次進塁</Text>
                    <Text>• 3塁にランナーがいれば得点</Text>
                  </Box>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>単打</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Text>• 打者は1塁に進塁</Text>
                    <Text>• 2塁・3塁のランナーは得点</Text>
                    <Text>• 1塁のランナーは3塁に進塁</Text>
                  </Box>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>2塁打</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Text>• 打者は2塁に進塁</Text>
                    <Text>• 全ランナーが得点</Text>
                    <Text>• 塁はクリア</Text>
                  </Box>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>3塁打・本塁打</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Text>• 全ランナーが得点</Text>
                    <Text>• 打者も得点（本塁打の場合）</Text>
                    <Text>• 塁はクリア</Text>
                  </Box>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* 打者順序の管理 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">
              <Group gap="sm" justify="center">
                <IconUsers size={24} />
                打者順序の管理
              </Group>
            </Title>
            
            <Text size="lg">
              野球のルールに従い、打者は1巡するように管理されています：
            </Text>

            <List size="lg" spacing="md">
              <List.Item>
                <Text fw={600}>各イニングの開始:</Text>
                <Text>前のイニングの最後の打者の次の打者から開始</Text>
              </List.Item>
              <List.Item>
                <Text fw={600}>打者順序:</Text>
                <Text>1番→2番→3番→...→9番→1番（循環）</Text>
              </List.Item>
              <List.Item>
                <Text fw={600}>チーム別管理:</Text>
                <Text>ホームチームとアウェイチームで別々に打者順序を管理</Text>
              </List.Item>
            </List>

            <Alert
              title="実装例"
              color="green"
              variant="light"
              icon={<IconCalculator size={16} />}
            >
              <Text>
                1回表: 選手1から開始 → 選手5で終了<br/>
                1回裏: 選手1から開始 → 選手3で終了<br/>
                2回表: 選手6から開始（選手5の次の打者）
              </Text>
            </Alert>
          </Stack>
        </Paper>

        {/* 統計計算 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">
              <Group gap="sm" justify="center">
                <IconChartBar size={24} />
                統計計算
              </Group>
            </Title>
            
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>打率</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Code block>
                      打率 = 安打数 / 打数
                    </Code>
                    <Text mt="md" size="sm">
                      例: 135安打 ÷ 450打数 = .300
                    </Text>
                  </Box>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>出塁率</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Code block>
                      出塁率 = (安打 + 四球 + 死球) / (打数 + 四球 + 死球 + 犠飛)
                    </Code>
                    <Text mt="md" size="sm">
                      例: (135 + 45 + 5) ÷ (450 + 45 + 5 + 8) = .364
                    </Text>
                  </Box>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>長打率</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Code block>
                      長打率 = (単打 + 2×2塁打 + 3×3塁打 + 4×本塁打) / 打数
                    </Code>
                    <Text mt="md" size="sm">
                      例: (92 + 2×25 + 3×3 + 4×15) ÷ 450 = .436
                    </Text>
                  </Box>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section withBorder inheritPadding py="xs">
                    <Title order={3}>OPS</Title>
                  </Card.Section>
                  <Box mt="md">
                    <Code block>
                      OPS = 出塁率 + 長打率
                    </Code>
                    <Text mt="md" size="sm">
                      例: .364 + .436 = .800
                    </Text>
                  </Box>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* 注意事項 */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} ta="center">注意事項</Title>
            
            <Alert
              title="シミュレーションの性質"
              color="yellow"
              variant="light"
              icon={<IconInfoCircle size={16} />}
            >
              <Text>
                このシミュレーションは確率的な計算に基づいています。実際の野球とは異なる結果が出る場合があります。
                選手の過去の成績は参考値として使用され、実際の試合でのパフォーマンスを保証するものではありません。
              </Text>
            </Alert>

            <Alert
              title="計算の簡略化"
              color="blue"
              variant="light"
              icon={<IconCalculator size={16} />}
            >
              <Text>
                実際の野球では考慮される要素（投手の能力、守備力、球場の特性、天候など）は簡略化されています。
                より現実的なシミュレーションのためには、これらの要素を追加する必要があります。
              </Text>
            </Alert>

            <Alert
              title="データの信頼性"
              color="green"
              variant="light"
              icon={<IconTarget size={16} />}
            >
              <Text>
                シミュレーションの精度は、入力される選手データの質に大きく依存します。
                より正確な結果を得るためには、十分なサンプルサイズの成績データを使用してください。
              </Text>
            </Alert>
          </Stack>
        </Paper>

        {/* 戻るボタン */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Center>
            <Button
              size="lg"
              leftSection={<IconHome size={20} />}
              onClick={() => router.push('/home')}
              color="blue"
            >
              ホームに戻る
            </Button>
          </Center>
        </Paper>
      </Stack>
    </Container>
  );
} 