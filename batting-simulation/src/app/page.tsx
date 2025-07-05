'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Text, Loader, Center, Paper, Title } from '@mantine/core';
import { IconBallBaseball } from '@tabler/icons-react';

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    // ホームページにリダイレクト
    router.push('/home');
  }, [router]);

  return (
    <Container size="sm" py="xl">
      <Paper shadow="xs" p="xl" radius="md" withBorder>
        <Stack gap="xl" align="center">
          <Center>
            <Loader size="xl" color="blue" />
          </Center>
          <Stack gap="md" align="center">
            <IconBallBaseball size={48} color="var(--mantine-color-blue-6)" />
            <Title order={2}>リダイレクト中...</Title>
            <Text c="dimmed" ta="center" size="lg">
              ホームページに移動しています
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
