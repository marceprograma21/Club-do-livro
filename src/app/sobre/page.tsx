import Link from 'next/link';

import { Header, Footer } from '@/src/components';

const VALUES = [
{
    title: 'Leitura em comum',
    text: 'Um livro por mês, escolhido junto, para todo mundo ler no seu ritmo.',
},
{
    title: 'Conversa de verdade',
    text: 'Encontros para debater o que a história provocou em cada um.',
},
{
    title: 'Portas abertas',
    text: 'Quem ama ler é bem-vindo, seja leitor de longa data ou iniciante.',
},
];

export default function AboutPage() {
    return (
    <div className='flex min-h-screen flex-col bg-[#f6efe4]'>
    <Header title='Clube do livro' />

    <main className='flex-1'>
        <section className='relative overflow-hidden px-6 py-16 sm:py-24'>
        <div
            aria-hidden
            className='pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60'
            style={{
            backgroundImage:
                'radial-gradient(rgba(43,29,20,.10) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent)',
            WebkitMaskImage:
                'linear-gradient(to bottom, black 20%, transparent)',
            }}
        />

        <div className='relative mx-auto max-w-3xl text-center'>
            <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
            Sobre
            </p>
            <h1 className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-6xl'>
            Boas histórias ficam melhores em boa{' '}
            <span className='italic text-[#1f3d2e]'>companhia</span>
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#6b5a4c]'>
            O Clube do Livro nasceu da vontade de transformar a leitura em
            encontro. Aqui, cada livro é um convite para conversar, discordar,
            se emocionar e descobrir novos pontos de vista.
            </p>
        </div>
        </section>

        <section className='border-t border-[#d9c9a8] bg-[#f1e8d6] px-6 py-16'>
        <div className='mx-auto grid max-w-5xl gap-6 md:grid-cols-3'>
            {VALUES.map((value, index) => (
            <article
                key={value.title}
                className='rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5'
            >
                <span className='font-serif text-3xl text-[#b88a44]'>
                0{index + 1}
                </span>
                <h2 className='mt-3 font-serif text-xl font-semibold text-[#2b1d14]'>
                {value.title}
                </h2>
                <p className='mt-2 text-sm leading-relaxed text-[#6b5a4c]'>
                {value.text}
                </p>
            </article>
            ))}
        </div>

        <div className='mt-12 text-center'>
            <Link
            href='/home#livros'
            className='inline-block rounded-lg bg-[#1f3d2e] px-6 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] active:scale-95'
            >
            Conhecer a estante
            </Link>
        </div>
        </section>
    </main>

    <Footer />
    </div>
);
}