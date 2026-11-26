import { Header, Footer } from '@/src/components';
import Devolucoes from '@/src/components/Devolucoes';

export default function DevolucoesPage() {
  return (
    <div className='flex min-h-screen flex-col bg-[#f6efe4]'>
      <Header title='Clube do livro' />

      <main className='flex-1 px-6 py-16 sm:py-20'>
        <Devolucoes isPage />
      </main>

      <Footer />
    </div>
  );
}