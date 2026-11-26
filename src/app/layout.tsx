import type { Metadata } from 'next';
import './globals.css';
import { BibliotecaProvider } from '@/src/context/BibliotecaContext';

export const metadata: Metadata = {
  title: 'Clube do livro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR' data-scroll-behavior='smooth'>
      <body>
        <BibliotecaProvider>{children}</BibliotecaProvider>
      </body>
    </html>
  );
}