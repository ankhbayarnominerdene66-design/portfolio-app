// src/app/layout.js
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'А.Номин-Эрдэнэ | Portfolio',
  description:
    'Их Засаг Их Сургуулийн програм хангамжийн оюутан А.Номин-Эрдэнэгийн portfolio веб сайт.',
  keywords: ['portfolio', 'developer', 'Mongolia', 'software engineer', 'Nomin-Erdene'],
  authors: [{ name: 'А.Номин-Эрдэнэ' }],
  openGraph: {
    title: 'А.Номин-Эрдэнэ | Portfolio',
    description: 'Програм хангамжийн оюутан, web developer',
    type: 'website',
    locale: 'mn_MN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'А.Номин-Эрдэнэ | Portfolio',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
