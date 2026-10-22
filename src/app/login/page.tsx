'use client';

import { useState } from 'react';

const books = [
  { h: 120, w: 26, color: '#8c2f39' },
  { h: 150, w: 32, color: '#b88a44' },
  { h: 105, w: 24, color: '#f1e7d3' },
  { h: 140, w: 30, color: '#2f5d46', tilt: true },
  { h: 125, w: 28, color: '#5b3a29' },
  { h: 155, w: 34, color: '#8c2f39' },
  { h: 110, w: 24, color: '#d9c9a8' },
  { h: 135, w: 30, color: '#b88a44' },
  { h: 118, w: 26, color: '#3b6b8a' },
  { h: 148, w: 32, color: '#f1e7d3' },
];

const highlights = [
  { title: 'Livro do mês', text: 'Uma leitura em comum para todo o clube.' },
  { title: 'Encontros e debates', text: 'Converse sobre o que você acabou de ler.' },
  { title: 'Sua estante pessoal', text: 'Guarde o que já leu e o que quer ler.' },
];

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    setLoading(true);
    try {
      // TODO: reemplazar por la llamada real a tu API de autenticación
      console.log({ email, password });
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='grid min-h-screen w-full bg-[#f6efe4] lg:grid-cols-[1.05fr_1fr]'>
      {/* ───────── Panel literario ───────── */}
      <section className='relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#234a37] via-[#1f3d2e] to-[#14291f] p-14 lg:flex'>
        {/* Textura de puntos */}
        <div
          aria-hidden
          className='absolute inset-0 opacity-[0.12]'
          style={{
            backgroundImage:
              'radial-gradient(rgba(246,239,228,.9) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div
          aria-hidden
          className='absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-[#b88a44] opacity-20 blur-[110px]'
        />

        {/* Logo */}
        <div className='relative z-10 flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-full border border-[#b88a44]/60 bg-[#b88a44]/15 text-[#e6c88a]'>
            <BookIcon className='h-6 w-6' />
          </div>
          <span className='font-serif text-2xl tracking-tight text-[#f6efe4]'>
            Clube do Livro
          </span>
        </div>

        {/* Mensaje */}
        <div className='relative z-10 max-w-lg'>
          <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#e6c88a]'>
            Leia junto
          </p>
          <h2 className='mt-4 font-serif text-5xl leading-[1.1] tracking-tight text-[#f6efe4]'>
            Boas histórias ficam melhores em boa{' '}
            <span className='italic text-[#e6c88a]'>companhia</span>.
          </h2>

          <ul className='mt-10 space-y-5'>
            {highlights.map((item) => (
              <li key={item.title} className='flex gap-4'>
                <span className='mt-2 h-px w-6 shrink-0 bg-[#b88a44]' />
                <div>
                  <p className='font-serif text-lg text-[#f6efe4]'>
                    {item.title}
                  </p>
                  <p className='text-sm text-[#cfd8cf]/80'>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Estantería */}
        <div className='relative z-10'>
          <div className='flex items-end gap-1.5 px-2'>
            {books.map((book, index) => (
              <div
                key={index}
                className={`relative rounded-t-[3px] shadow-md shadow-black/30 ${
                  book.tilt ? 'origin-bottom rotate-[10deg]' : ''
                }`}
                style={{
                  height: book.h,
                  width: book.w,
                  backgroundColor: book.color,
                }}
              >
                <span className='absolute inset-x-0 top-4 h-1.5 bg-black/20' />
                <span className='absolute inset-x-0 top-7 h-px bg-black/20' />
              </div>
            ))}
          </div>
          <div className='h-2.5 rounded-sm bg-[#5b3a29] shadow-lg shadow-black/40' />
          <p className='mt-6 text-xs text-[#cfd8cf]/60'>
            © {new Date().getFullYear()} Clube do Livro. Todos os direitos
            reservados.
          </p>
        </div>
      </section>

      {/* ───────── Formulario ───────── */}
      <section className='flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-[400px]'>
          {/* Logo móvil */}
          <div className='mb-10 flex items-center gap-3 lg:hidden'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#1f3d2e] text-[#e6c88a]'>
              <BookIcon className='h-5 w-5' />
            </div>
            <span className='font-serif text-xl text-[#2b1d14]'>
              Clube do Livro
            </span>
          </div>

          <header>
            <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
              Área do leitor
            </p>
            <h1 className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14]'>
              Bem-vindo(a) de volta
            </h1>
            <p className='mt-2 text-sm text-[#6b5a4c]'>
              Entre para ver o livro do mês e continuar a conversa.
            </p>
          </header>

          <form onSubmit={handleLogin} className='mt-8 space-y-5'>
            <div className='space-y-1.5'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-[#2b1d14]'
              >
                E-mail
              </label>
              <input
                type='email'
                name='email'
                id='email'
                required
                autoComplete='email'
                placeholder='voce@email.com'
                className='w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15'
              />
            </div>

            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-[#2b1d14]'
                >
                  Senha
                </label>
                <a
                  href='#'
                  className='text-xs font-medium text-[#8c2f39] hover:underline'
                >
                  Esqueci minha senha
                </a>
              </div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  id='password'
                  required
                  autoComplete='current-password'
                  placeholder='••••••••'
                  className='w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] py-3 pl-4 pr-16 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 text-xs font-medium text-[#6b5a4c] transition hover:text-[#2b1d14]'
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <label className='flex cursor-pointer items-center gap-2.5 text-sm text-[#6b5a4c]'>
              <input
                type='checkbox'
                name='remember'
                className='h-4 w-4 rounded border-[#d9c9a8] accent-[#1f3d2e]'
              />
              Manter-me conectado
            </label>

            <button
              type='submit'
              disabled={loading}
              className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f3d2e] px-4 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1f3d2e]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70'
            >
              {loading ? (
                <>
                  <svg
                    className='h-4 w-4 animate-spin'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <circle
                      cx='12'
                      cy='12'
                      r='9'
                      stroke='currentColor'
                      strokeOpacity='.3'
                      strokeWidth='3'
                    />
                    <path
                      d='M21 12a9 9 0 0 0-9-9'
                      stroke='currentColor'
                      strokeWidth='3'
                      strokeLinecap='round'
                    />
                  </svg>
                  Abrindo o livro...
                </>
              ) : (
                'Entrar no clube'
              )}
            </button>
          </form>

          <div className='my-8 flex items-center gap-3 text-[#a8967f]'>
            <span className='h-px flex-1 bg-[#d9c9a8]' />
            <BookIcon className='h-4 w-4' />
            <span className='h-px flex-1 bg-[#d9c9a8]' />
          </div>

          <p className='text-center text-sm text-[#6b5a4c]'>
            Ainda não faz parte?{' '}
            <a
              href='#'
              className='font-medium text-[#8c2f39] hover:underline'
            >
              Quero entrar para o clube
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}