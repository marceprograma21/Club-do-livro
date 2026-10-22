'use client';

import { useState } from 'react';

import { Header, Footer } from '@/src/components';

const inputClass =
'w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15';

const CONTACTS = [
{ label: 'E-mail', value: 'contato@seuclube.com' },
{ label: 'Instagram', value: '@seuclube' },
{ label: 'Encontros', value: 'Todo último sábado do mês' },
];

export default function ContactsPage() {
const [sent, setSent] = useState(false);

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    // TODO: enviar para sua API / serviço de e-mail
    console.log(Object.fromEntries(formData.entries()));

    setSent(true);
    event.currentTarget.reset();
}

return (
    <div className='flex min-h-screen flex-col bg-[#f6efe4]'>
    <Header title='Clube do livro' />

    <main className='relative flex-1 px-6 py-16 sm:py-20'>
        <div className='mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[1fr_1.1fr]'>

        <div>
            <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
            Contatos
            </p>
            <h1 className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-5xl'>
            Vamos <span className='italic text-[#1f3d2e]'>conversar</span>
            </h1>
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
            onSubmit={handleSubmit}
            className='space-y-5 rounded-3xl border border-[#d9c9a8] bg-[#fffaf1] p-8 shadow-xl shadow-[#5b3a29]/10'
        >
            <div className='space-y-1.5'>
            <label htmlFor='name' className='text-sm font-medium text-[#2b1d14]'>
                Nome
            </label>
            <input
                id='name'
                name='name'
                required
                placeholder='Seu nome'
                className={inputClass}
            />
            </div>

            <div className='space-y-1.5'>
            <label htmlFor='email' className='text-sm font-medium text-[#2b1d14]'>
                E-mail
            </label>
            <input
                id='email'
                name='email'
                type='email'
                required
                placeholder='voce@email.com'
                className={inputClass}
            />
            </div>

            <div className='space-y-1.5'>
            <label htmlFor='message' className='text-sm font-medium text-[#2b1d14]'>
                Mensagem
            </label>
            <textarea
                id='message'
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

            {sent && (
            <p className='text-center font-serif text-base italic text-[#2f5d46]'>
                Mensagem enviada! Responderemos em breve.
            </p>
            )}
        </form>
        </div>
    </main>

    <Footer />
    </div>
  );
}