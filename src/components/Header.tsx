'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HeaderProps = {
  title: string;
  logoSrc?: string;
};

// Cada enlace baja a una sección de /home (el id debe existir en la página)
const LINKS = [
  { label: 'Home', id: 'inicio' },
  { label: 'Sobre', id: 'sobre' },
  { label: 'Produtos', id: 'livros' },
  { label: 'Contatos', id: 'contatos' },
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

export function Header({ title, logoSrc = '/logo.png' }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [activeId, setActiveId] = useState('inicio');

  const isHome = pathname === '/home';

  // Marca en el menú la sección que se está viendo
  useEffect(() => {
    if (!isHome) return;

    const elements = LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  function isActive(id: string) {
    return isHome && activeId === id;
  }

  // En /home desliza suavemente hasta la sección; en otras rutas navega normal
  function handleNavClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    setOpen(false);
    if (!isHome) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `/home#${id}`);
  }

  return (
    <header className='sticky top-0 z-50 border-b border-[#d9c9a8] bg-[#f6efe4]/85 backdrop-blur-md'>
      <div className='mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-6 px-6'>
        {/* Logo + nombre */}
        <Link
          href='/home#inicio'
          onClick={(event) => handleNavClick(event, 'inicio')}
          className='group flex items-center gap-3'
        >
          {logoFailed ? (
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#1f3d2e] text-[#e6c88a]'>
              <BookIcon className='h-6 w-6' />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={title}
              onError={() => setLogoFailed(true)}
              className='h-12 w-12 rounded-full object-cover ring-1 ring-[#d9c9a8] transition group-hover:scale-105'
            />
          )}

          <div className='leading-tight'>
            <p className='font-serif text-xl font-semibold tracking-tight text-[#2b1d14]'>
              {title}
            </p>
            <p className='hidden text-[11px] uppercase tracking-[0.25em] text-[#8c2f39] sm:block'>
              Leia junto
            </p>
          </div>
        </Link>

        {/* Navegación escritorio */}
        <nav className='hidden items-center gap-8 md:flex'>
          {LINKS.map((link) => {
            const active = isActive(link.id);
            return (
              <Link
                key={link.id}
                href={`/home#${link.id}`}
                onClick={(event) => handleNavClick(event, link.id)}
                className={`group relative py-1 text-sm transition-colors ${
                  active
                    ? 'font-semibold text-[#1f3d2e]'
                    : 'font-medium text-[#6b5a4c] hover:text-[#2b1d14]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#b88a44] transition-transform duration-300 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}

          <Link
            href='/login'
            className='rounded-lg bg-[#1f3d2e] px-5 py-2.5 text-sm font-semibold text-[#f6efe4] shadow-md shadow-[#1f3d2e]/20 transition hover:bg-[#2a5240] active:scale-95'
          >
            Entrar
          </Link>
        </nav>

        {/* Botón menú móvil */}
        <button
          type='button'
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[#d9c9a8] bg-[#fffaf1] text-[#2b1d14] transition hover:bg-white md:hidden'
        >
          {open ? (
            <svg viewBox='0 0 24 24' fill='none' className='h-5 w-5'>
              <path
                d='M6 6l12 12M18 6 6 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          ) : (
            <svg viewBox='0 0 24 24' fill='none' className='h-5 w-5'>
              <path
                d='M4 7h16M4 12h16M4 17h16'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <nav className='border-t border-[#d9c9a8] bg-[#f6efe4] px-6 pb-6 pt-3 md:hidden'>
          <ul className='flex flex-col'>
            {LINKS.map((link) => {
              const active = isActive(link.id);
              return (
                <li key={link.id}>
                  <Link
                    href={`/home#${link.id}`}
                    onClick={(event) => handleNavClick(event, link.id)}
                    className={`block border-b border-[#e4d6b9] py-3 text-base ${
                      active
                        ? 'font-semibold text-[#1f3d2e]'
                        : 'text-[#6b5a4c]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href='/login'
            onClick={() => setOpen(false)}
            className='mt-5 block rounded-lg bg-[#1f3d2e] px-4 py-3 text-center text-sm font-semibold text-[#f6efe4]'
          >
            Entrar
          </Link>
        </nav>
      )}
    </header>
  );
}