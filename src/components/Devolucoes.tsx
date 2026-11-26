'use client';

import { useState } from 'react';

import { useBiblioteca, type Emprestimo } from '@/src/context/BibliotecaContext';
import { calcularAtraso, dataRelativa, formatarData } from '@/src/utils/datas';

type Status = 'Em andamento' | 'Atrasado' | 'Devolvido';

const FILTROS = ['Todos', 'Em andamento', 'Atrasado', 'Devolvido'] as const;

const inputClass =
  'w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15';

const statusClass: Record<Status, string> = {
  Devolvido: 'bg-[#2f5d46]/15 text-[#2f5d46]',
  Atrasado: 'bg-[#8c2f39]/15 text-[#8c2f39]',
  'Em andamento': 'bg-[#b88a44]/20 text-[#7a5a22]',
};

/**
 * Painel de controle de devoluções.
 * Os dados vêm do contexto compartilhado (livros, participantes, empréstimos).
 * isPage = true  → usado na rota /devolucoes (título como h1)
 * isPage = false → usado como seção na página inicial (título como h2)
 */
export default function Devolucoes({ isPage = false }: { isPage?: boolean }) {
  const { emprestimos, livros, participantes, pronto, registrarDevolucao } =
    useBiblioteca();

  const [pesquisa, setPesquisa] = useState('');
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('Todos');
  const [erro, setErro] = useState('');

  const hoje = dataRelativa(0);

  function obterStatus(emprestimo: Emprestimo): Status {
    if (emprestimo.devolvidoEm) return 'Devolvido';
    if (emprestimo.dataDevolucao < hoje) return 'Atrasado';
    return 'Em andamento';
  }

  function nomeDoLivro(id: string) {
    return livros.find((l) => l.id === id)?.titulo ?? 'Livro removido';
  }

  function nomeDoLeitor(id: string) {
    return participantes.find((p) => p.id === id)?.nome ?? 'Participante removido';
  }

  function handleDevolucao(id: string) {
    const resultado = registrarDevolucao(id);
    setErro(resultado.ok ? '' : resultado.erro);
  }

  const termo = pesquisa.toLowerCase();

  const emprestimosFiltrados = emprestimos.filter((emprestimo) => {
    const correspondePesquisa =
      nomeDoLivro(emprestimo.livroId).toLowerCase().includes(termo) ||
      nomeDoLeitor(emprestimo.participanteId).toLowerCase().includes(termo);

    const correspondeFiltro =
      filtro === 'Todos' || obterStatus(emprestimo) === filtro;

    return correspondePesquisa && correspondeFiltro;
  });

  const totalEmprestados = emprestimos.filter((e) => !e.devolvidoEm).length;
  const totalAtrasados = emprestimos.filter(
    (e) => obterStatus(e) === 'Atrasado',
  ).length;
  const totalDevolvidos = emprestimos.filter((e) => e.devolvidoEm).length;

  const resumo = [
    { label: 'Livros emprestados', value: totalEmprestados, color: '#b88a44' },
    { label: 'Devoluções atrasadas', value: totalAtrasados, color: '#8c2f39' },
    { label: 'Livros devolvidos', value: totalDevolvidos, color: '#2f5d46' },
  ];

  const Titulo = isPage ? 'h1' : 'h2';

  if (!pronto) {
    return (
      <p className='py-20 text-center font-serif text-lg italic text-[#6b5a4c]'>
        Carregando...
      </p>
    );
  }

  return (
    <div className='mx-auto w-full max-w-6xl'>
      {/* Cabeçalho */}
      <header className='mb-10'>
        <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
          Biblioteca
        </p>
        <Titulo className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-5xl'>
          Controle de <span className='italic text-[#1f3d2e]'>devoluções</span>
        </Titulo>
        <p className='mt-3 max-w-xl text-base text-[#6b5a4c]'>
          Gerenciamento de empréstimos, prazos e devoluções dos livros.
        </p>
      </header>

      {/* Resumo */}
      <section className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {resumo.map((item) => (
          <div
            key={item.label}
            className='rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5'
          >
            <p className='text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
              {item.label}
            </p>
            <p
              className='mt-2 font-serif text-4xl font-semibold tabular-nums'
              style={{ color: item.color }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* Pesquisa e filtros */}
      <section className='mb-6 rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5'>
        <h3 className='mb-4 font-serif text-xl font-semibold text-[#2b1d14]'>
          Gerenciar empréstimos
        </h3>

        <input
          type='text'
          placeholder='Pesquisar por livro ou leitor...'
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className={`${inputClass} mb-4`}
        />

        <div className='flex flex-wrap gap-2'>
          {FILTROS.map((opcao) => (
            <button
              key={opcao}
              type='button'
              onClick={() => setFiltro(opcao)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                filtro === opcao
                  ? 'bg-[#1f3d2e] text-[#f6efe4]'
                  : 'border border-[#d9c9a8] bg-[#f6efe4] text-[#6b5a4c] hover:bg-white'
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>

        {erro && (
          <p role='alert' className='mt-4 text-sm font-medium text-[#8c2f39]'>
            {erro}
          </p>
        )}
      </section>

      {/* Lista de empréstimos */}
      <section className='overflow-hidden rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] shadow-sm shadow-[#5b3a29]/5'>
        <div className='border-b border-[#d9c9a8] p-6'>
          <h3 className='font-serif text-xl font-semibold text-[#2b1d14]'>
            Lista de empréstimos
          </h3>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-[#f1e8d6] text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
              <tr>
                <th className='p-4'>Livro</th>
                <th className='p-4'>Leitor</th>
                <th className='p-4'>Empréstimo</th>
                <th className='p-4'>Prazo</th>
                <th className='p-4'>Status</th>
                <th className='p-4'>Ação</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[#e4d6b9]'>
              {emprestimosFiltrados.map((emprestimo) => {
                const status = obterStatus(emprestimo);
                const atraso = calcularAtraso(emprestimo.dataDevolucao);

                return (
                  <tr key={emprestimo.id} className='hover:bg-[#f6efe4]'>
                    <td className='p-4 font-serif text-base font-semibold text-[#2b1d14]'>
                      {nomeDoLivro(emprestimo.livroId)}
                    </td>

                    <td className='p-4 text-[#6b5a4c]'>
                      {nomeDoLeitor(emprestimo.participanteId)}
                    </td>

                    <td className='p-4 tabular-nums text-[#6b5a4c]'>
                      {formatarData(emprestimo.dataEmprestimo)}
                    </td>

                    <td className='p-4 tabular-nums text-[#6b5a4c]'>
                      {formatarData(emprestimo.dataDevolucao)}

                      {!emprestimo.devolvidoEm && atraso > 0 && (
                        <p className='mt-1 text-xs font-medium text-[#8c2f39]'>
                          {atraso} dia(s) de atraso
                        </p>
                      )}

                      {!emprestimo.devolvidoEm && atraso === 0 && (
                        <p className='mt-1 text-xs font-medium text-[#b88a44]'>
                          Vence hoje
                        </p>
                      )}
                    </td>

                    <td className='p-4'>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[status]}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className='p-4'>
                      {emprestimo.devolvidoEm ? (
                        <span className='text-xs font-medium text-[#2f5d46]'>
                          Devolvido em {formatarData(emprestimo.devolvidoEm)}
                        </span>
                      ) : (
                        <button
                          type='button'
                          onClick={() => handleDevolucao(emprestimo.id)}
                          className='cursor-pointer rounded-lg bg-[#1f3d2e] px-3 py-2 text-xs font-semibold text-[#f6efe4] shadow-md shadow-[#1f3d2e]/20 transition hover:bg-[#2a5240] active:scale-95'
                        >
                          Registrar devolução
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {emprestimosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className='p-10 text-center font-serif text-lg italic text-[#6b5a4c]'
                  >
                    Nenhum empréstimo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}