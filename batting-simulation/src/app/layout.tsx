import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "野球シミュレーション",
  description: "野球の打撃成績をシミュレーションするアプリ",
};

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: geistSans.style.fontFamily,
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
