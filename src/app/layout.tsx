import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const interSans = Inter({
  variable: '--font-inter-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Clube do livro',
  description: 'Clube do livro da FAP',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en' className={`${interSans.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  );
}
