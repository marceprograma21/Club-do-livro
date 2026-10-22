'use client';

import { useEffect, useRef, useState } from 'react';

import { Header, Footer } from '@/src/components';
import { ProductCard } from '@/src/components/ProductCard';
import { PRODUCTS } from '@/src/utils/products';

const DURATION = 5000; // ms
const RADIUS = 118;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Status = 'idle' | 'running' | 'finished';

const inputClass =
  'w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15';

const SPINES = [
  { h: 96, w: 22, color: '#8c2f39' },
  { h: 120, w: 28, color: '#b88a44' },
  { h: 84, w: 20, color: '#d9c9a8' },
  { h: 112, w: 26, color: '#2f5d46', tilt: true },
  { h: 100, w: 24, color: '#5b3a29' },
  { h: 124, w: 30, color: '#8c2f39' },
  { h: 88, w: 20, color: '#e4d6b9' },
  { h: 108, w: 26, color: '#b88a44' },
  { h: 94, w: 22, color: '#3b6b8a' },
  { h: 118, w: 28, color: '#1f3d2e' },
];

// Troque pelos dados reais do clube
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

const CONTACTS = [
  { label: 'E-mail', value: 'contato@seuclube.com' },
  { label: 'Instagram', value: '@seuclube' },
  { label: 'Encontros', value: 'Todo último sábado do mês' },
];

function getFeedback(pages: number) {
  if (pages >= 45) return 'Leitor voraz! Que velocidade!';
  if (pages >= 30) return 'Ritmo de quem não larga o livro.';
  if (pages >= 18) return 'Uma leitura animada, parabéns!';
  if (pages >= 8) return 'Bom começo, o capítulo está só esquentando.';
  return 'Com calma também se chega ao final. Tente de novo!';
}

function BookIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' fill='none' className={className}>
      <path
        d='M12 6.5C10.3 5.2 8 4.8 4.5 5v12.5c3.5-.2 5.8.2 7.5 1.5m0-12.5c1.7-1.3 4-1.7 7.5-1.5V17.5c-3.5-.2-5.8.2-7.5 1.5m0-12.5V19'
        stroke='currentColor'
        strokeWidth='1.7'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function Divider() {
  return (
    <div className='my-10 flex items-center gap-3 text-[#a8967f]'>
      <span className='h-px flex-1 bg-[#d9c9a8]' />
      <BookIcon className='h-4 w-4' />
      <span className='h-px flex-1 bg-[#d9c9a8]' />
    </div>
  );
}

export default function HomePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [pages, setPages] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [best, setBest] = useState(0);
  const [messageSent, setMessageSent] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpia el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Actualiza el récord cuando termina la ronda
  useEffect(() => {
    if (status === 'finished') {
      setBest((prev) => Math.max(prev, pages));
    }
  }, [status, pages]);

  function startTimer() {
    const endsAt = Date.now() + DURATION;

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, endsAt - Date.now());
      setTimeLeft(remaining);

      if (remaining === 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setStatus('finished');
      }
    }, 50);
  }

  function handleClick() {
    if (status === 'finished') return;

    if (status === 'idle') {
      setStatus('running');
      startTimer();
    }

    setPages((current) => current + 1);
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    setStatus('idle');
    setPages(0);
    setTimeLeft(DURATION);
  }

  function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    // TODO: enviar para sua API / serviço de e-mail
    console.log(Object.fromEntries(formData.entries()));

    setMessageSent(true);
    form.reset();
  }

  const elapsed = (DURATION - timeLeft) / 1000;
  const pace =
    status === 'finished'
      ? pages / (DURATION / 1000)
      : elapsed > 0.2
        ? pages / elapsed
        : 0;

  const dashOffset = CIRCUMFERENCE * (1 - timeLeft / DURATION);
  const isFinished = status === 'finished';

  const totalBooks = PRODUCTS.length;
  const availableBooks = PRODUCTS.filter((p) => p.isAvailable).length;

  return (
    <div className='flex min-h-screen flex-col bg-[#f6efe4]'>
      <Header title='Clube do livro' />

      {/* ───────── 1. Home / Hero ───────── */}
      <section
        id='inicio'
        className='relative scroll-mt-24 overflow-hidden px-6 pb-16 pt-16 sm:pb-20 sm:pt-24'
      >
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 opacity-60'
          style={{
            backgroundImage:
              'radial-gradient(rgba(43,29,20,.10) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage:
              'radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)',
          }}
        />

        <div className='relative mx-auto max-w-3xl text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
            Bem-vindo ao clube
          </p>
          <h1 className='mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-[#2b1d14] sm:text-6xl'>
            Boas histórias ficam melhores em boa{' '}
            <span className='italic text-[#1f3d2e]'>companhia</span>
          </h1>
          <p className='mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#6b5a4c]'>
            Leia, converse e descubra novos livros com quem também ama uma boa
            história.
          </p>

          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <a
              href='#livros'
              className='w-full rounded-lg bg-[#1f3d2e] px-6 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] active:scale-95 sm:w-auto'
            >
              Ver a estante
            </a>
            <a
              href='#contatos'
              className='w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-6 py-3 text-sm font-semibold text-[#2b1d14] transition hover:bg-white active:scale-95 sm:w-auto'
            >
              Falar com o clube
            </a>
          </div>
        </div>

        {/* Estantería decorativa */}
        <div className='relative mx-auto mt-16 max-w-md' aria-hidden>
          <div className='flex items-end justify-center gap-1.5 px-2'>
            {SPINES.map((book, index) => (
              <div
                key={index}
                className={`relative rounded-t-[3px] shadow-md shadow-black/20 ${
                  book.tilt ? 'origin-bottom rotate-[10deg]' : ''
                }`}
                style={{
                  height: book.h,
                  width: book.w,
                  backgroundColor: book.color,
                }}
              >
                <span className='absolute inset-x-0 top-3 h-1.5 bg-black/20' />
                <span className='absolute inset-x-0 top-6 h-px bg-black/20' />
              </div>
            ))}
          </div>
          <div className='h-2.5 rounded-sm bg-[#5b3a29] shadow-lg shadow-black/30' />
        </div>
      </section>

      {/* ───────── 2. Sobre ───────── */}
      <section
        id='sobre'
        className='scroll-mt-24 border-t border-[#d9c9a8] bg-[#f1e8d6] px-6 py-16 sm:py-20'
      >
        <div className='mx-auto max-w-5xl'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
              Sobre
            </p>
            <h2 className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-5xl'>
              Um clube feito de{' '}
              <span className='italic text-[#1f3d2e]'>leitores</span>
            </h2>
            <p className='mt-4 text-base leading-relaxed text-[#6b5a4c]'>
              O Clube do Livro nasceu da vontade de transformar a leitura em
              encontro. Aqui, cada livro é um convite para conversar, discordar,
              se emocionar e descobrir novos pontos de vista.
            </p>
          </div>

          <div className='mt-12 grid gap-6 md:grid-cols-3'>
            {VALUES.map((value, index) => (
              <article
                key={value.title}
                className='rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5'
              >
                <span className='font-serif text-3xl text-[#b88a44]'>
                  0{index + 1}
                </span>
                <h3 className='mt-3 font-serif text-xl font-semibold text-[#2b1d14]'>
                  {value.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-[#6b5a4c]'>
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 3. Produtos / Estante ───────── */}
      <section
        id='livros'
        className='scroll-mt-24 border-t border-[#d9c9a8] px-6 py-16 sm:py-20'
      >
        <div className='mx-auto w-full max-w-6xl'>
          <header className='flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between'>
            <div className='max-w-xl'>
              <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
                Produtos
              </p>
              <h2 className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-5xl'>
                Nossa <span className='italic text-[#1f3d2e]'>estante</span>
              </h2>
              <p className='mt-3 text-base text-[#6b5a4c]'>
                Livros escolhidos com carinho para quem ama ler. Encontre a sua
                próxima história.
              </p>
            </div>

            <dl className='flex gap-3'>
              <div className='rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] px-5 py-3 text-center'>
                <dd className='font-serif text-2xl font-semibold tabular-nums text-[#2b1d14]'>
                  {totalBooks}
                </dd>
                <dt className='text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
                  Títulos
                </dt>
              </div>
              <div className='rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] px-5 py-3 text-center'>
                <dd className='font-serif text-2xl font-semibold tabular-nums text-[#2f5d46]'>
                  {availableBooks}
                </dd>
                <dt className='text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
                  Disponíveis
                </dt>
              </div>
            </dl>
          </header>

          <Divider />

          {totalBooks === 0 ? (
            <div className='rounded-3xl border border-dashed border-[#d9c9a8] bg-[#fffaf1] px-6 py-20 text-center'>
              <p className='font-serif text-2xl text-[#2b1d14]'>
                A estante está vazia por enquanto
              </p>
              <p className='mt-2 text-sm text-[#6b5a4c]'>
                Novos livros chegam em breve. Volte logo!
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  imageUrl={product.imageUrl}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  isAvailable={product.isAvailable}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────── 4. Maratona de páginas ───────── */}
      <section
        id='jogo'
        className='relative flex scroll-mt-24 items-center justify-center overflow-hidden border-t border-[#d9c9a8] bg-[#f1e8d6] px-6 py-16 sm:py-20'
      >
        <div
          aria-hidden
          className='absolute inset-0 opacity-60'
          style={{
            backgroundImage:
              'radial-gradient(rgba(43,29,20,.10) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage:
              'radial-gradient(ellipse at center, black 20%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          }}
        />

        <div className='relative z-10 w-full max-w-md rounded-3xl border border-[#d9c9a8] bg-[#fffaf1] p-8 shadow-xl shadow-[#5b3a29]/10'>
          <div className='text-center'>
            <span className='inline-flex items-center gap-2 rounded-full border border-[#d9c9a8] bg-[#f6efe4] px-3 py-1 text-xs font-medium text-[#6b5a4c]'>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === 'running'
                    ? 'animate-pulse bg-[#2f5d46]'
                    : isFinished
                      ? 'bg-[#b88a44]'
                      : 'bg-[#8c2f39]'
                }`}
              />
              {status === 'running'
                ? 'Leitura em andamento'
                : isFinished
                  ? 'Fim do capítulo'
                  : 'Pronto para ler'}
            </span>

            <h2 className='mt-4 font-serif text-3xl tracking-tight text-[#2b1d14]'>
              Maratona de páginas
            </h2>
            <p className='mt-1 text-sm text-[#6b5a4c]'>
              Quantas páginas você vira em {DURATION / 1000} segundos?
            </p>
          </div>

          <div className='mt-6 grid grid-cols-3 gap-3'>
            {[
              { label: 'Páginas', value: pages.toString() },
              { label: 'Págs/seg', value: pace.toFixed(1) },
              { label: 'Recorde', value: best.toString() },
            ].map((stat) => (
              <div
                key={stat.label}
                className='rounded-2xl border border-[#e4d6b9] bg-[#f6efe4] px-3 py-2.5 text-center'
              >
                <p className='font-serif text-2xl font-semibold tabular-nums text-[#2b1d14]'>
                  {stat.value}
                </p>
                <p className='mt-0.5 text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className='relative mx-auto mt-6 h-[230px] w-[230px]'>
            <svg
              viewBox='0 0 260 260'
              className='absolute inset-0 -rotate-90'
              aria-hidden
            >
              <circle
                cx='130'
                cy='130'
                r={RADIUS}
                fill='none'
                stroke='rgba(43,29,20,0.10)'
                strokeWidth='8'
              />
              <circle
                cx='130'
                cy='130'
                r={RADIUS}
                fill='none'
                stroke={isFinished ? '#2f5d46' : '#8c2f39'}
                strokeWidth='8'
                strokeLinecap='round'
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke 0.3s' }}
              />
            </svg>

            <button
              type='button'
              onClick={handleClick}
              disabled={isFinished}
              aria-label='Virar página'
              className='absolute inset-[28px] flex select-none flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#2f5d46] to-[#1f3d2e] text-[#f6efe4] shadow-xl shadow-[#1f3d2e]/30 outline-none transition focus-visible:ring-4 focus-visible:ring-[#1f3d2e]/40 enabled:cursor-pointer enabled:hover:from-[#38705a] enabled:active:scale-95 disabled:cursor-not-allowed disabled:from-[#8f8577] disabled:to-[#6f665a] disabled:shadow-none'
            >
              <BookIcon className='mb-1 h-7 w-7 text-[#e6c88a]' />
              <span className='font-serif text-6xl font-semibold tabular-nums leading-none'>
                {pages}
              </span>
              <span className='mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e6c88a]'>
                {status === 'idle'
                  ? 'Virar a página'
                  : status === 'running'
                    ? 'Continue!'
                    : 'Tempo esgotado'}
              </span>
            </button>
          </div>

          <p className='mt-4 text-center text-sm text-[#6b5a4c]'>
            Tempo restante:{' '}
            <span className='font-semibold tabular-nums text-[#2b1d14]'>
              {(timeLeft / 1000).toFixed(1)}s
            </span>
          </p>

          <div className='mt-6 min-h-[88px]'>
            {isFinished ? (
              <div className='space-y-4 text-center'>
                <p className='font-serif text-base italic text-[#2f5d46]'>
                  {getFeedback(pages)}
                </p>
                <button
                  type='button'
                  onClick={handleReset}
                  className='w-full cursor-pointer rounded-xl bg-[#8c2f39] px-4 py-3 text-sm font-semibold text-[#fffaf1] shadow-lg shadow-[#8c2f39]/25 transition hover:bg-[#a03a45] active:scale-[0.99]'
                >
                  Ler novamente
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={handleReset}
                disabled={status === 'idle'}
                className='w-full cursor-pointer rounded-xl border border-[#d9c9a8] bg-transparent px-4 py-3 text-sm font-medium text-[#6b5a4c] transition hover:bg-[#f6efe4] disabled:cursor-not-allowed disabled:opacity-40'
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ───────── 5. Contatos ───────── */}
      <section
        id='contatos'
        className='scroll-mt-24 border-t border-[#d9c9a8] px-6 py-16 sm:py-20'
      >
        <div className='mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[1fr_1.1fr]'>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
              Contatos
            </p>
            <h2 className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-5xl'>
              Vamos <span className='italic text-[#1f3d2e]'>conversar</span>
            </h2>
            <p className='mt-4 max-w-md text-base text-[#6b5a4c]'>
              Dúvidas, sugestões de leitura ou vontade de entrar para o clube?
              Escreva para nós.
            </p>

            <ul className='mt-10 space-y-5'>
              {CONTACTS.map((item) => (
                <li key={item.label} className='flex gap-4'>
                  <span className='mt-3 h-px w-6 shrink-0 bg-[#b88a44]' />
                  <div>
                    <p className='text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
                      {item.label}
                    </p>
                    <p className='font-serif text-lg text-[#2b1d14]'>
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleContactSubmit}
            className='space-y-5 rounded-3xl border border-[#d9c9a8] bg-[#fffaf1] p-8 shadow-xl shadow-[#5b3a29]/10'
          >
            <div className='space-y-1.5'>
              <label
                htmlFor='contact-name'
                className='text-sm font-medium text-[#2b1d14]'
              >
                Nome
              </label>
              <input
                id='contact-name'
                name='name'
                required
                placeholder='Seu nome'
                className={inputClass}
              />
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='contact-email'
                className='text-sm font-medium text-[#2b1d14]'
              >
                E-mail
              </label>
              <input
                id='contact-email'
                name='email'
                type='email'
                required
                placeholder='voce@email.com'
                className={inputClass}
              />
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='contact-message'
                className='text-sm font-medium text-[#2b1d14]'
              >
                Mensagem
              </label>
              <textarea
                id='contact-message'
                name='message'
                required
                rows={5}
                placeholder='Conte o que você gostaria de dizer...'
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type='submit'
              className='w-full cursor-pointer rounded-lg bg-[#1f3d2e] px-4 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] active:scale-[0.99]'
            >
              Enviar mensagem
            </button>

            {messageSent && (
              <p className='text-center font-serif text-base italic text-[#2f5d46]'>
                Mensagem enviada! Responderemos em breve.
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}