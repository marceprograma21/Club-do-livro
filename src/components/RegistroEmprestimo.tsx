'use client';

import { useState, type FormEvent } from 'react';

import { useBiblioteca } from '@/src/context/BibliotecaContext';
import { dataRelativa, formatarData } from '@/src/utils/datas';

const PRAZO_PADRAO = 7; // dias corridos

const RESPONSAVEIS = ['Administrador', 'Participante (Autoatendimento)'];

const inputClass =
  'w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15';

function somarDias(dataISO: string, dias: number) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + dias);

  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

/**
 * Registro de empréstimos (RF 03) e controle de datas (RF 06).
 * Usa os livros e participantes do armazenamento compartilhado.
 * Módulo original: Alex.
 */
export default function RegistroEmprestimo({
  isPage = false,
}: {
  isPage?: boolean;
}) {
  const {
    livros,
    participantes,
    emprestimos,
    pronto,
    registrarEmprestimo,
    reiniciarDados,
  } = useBiblioteca();

  const hoje = dataRelativa(0);

  const [livroId, setLivroId] = useState('');
  const [participanteId, setParticipanteId] = useState('');
  const [dataRetirada, setDataRetirada] = useState(hoje);
  const [dataPrevista, setDataPrevista] = useState(
    somarDias(hoje, PRAZO_PADRAO),
  );
  const [responsavel, setResponsavel] = useState(RESPONSAVEIS[0]);
  const [feedback, setFeedback] = useState<{
    tipo: 'sucesso' | 'erro';
    mensagem: string;
  } | null>(null);

  const Titulo = isPage ? 'h1' : 'h2';

  const livrosDisponiveis = livros.filter((l) => l.disponivel);
  const emprestimosAtivos = emprestimos.filter((e) => !e.devolvidoEm);

  function nomeDoLivro(id: string) {
    return livros.find((l) => l.id === id)?.titulo ?? 'Livro removido';
  }

  function nomeDoLeitor(id: string) {
    return (
      participantes.find((p) => p.id === id)?.nome ?? 'Participante removido'
    );
  }

  function handleMudancaRetirada(novaData: string) {
    setDataRetirada(novaData);
    if (novaData) setDataPrevista(somarDias(novaData, PRAZO_PADRAO));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!livroId || !participanteId) {
      setFeedback({
        tipo: 'erro',
        mensagem:
          'Selecione um livro disponível e um participante antes de confirmar.',
      });
      return;
    }

    if (!dataRetirada || !dataPrevista) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Preencha as datas de retirada e de devolução.',
      });
      return;
    }

    const titulo = nomeDoLivro(livroId);
    const leitor = nomeDoLeitor(participanteId);

    const resultado = registrarEmprestimo({
      livroId,
      participanteId,
      dataEmprestimo: dataRetirada,
      dataDevolucao: dataPrevista,
      registradoPor: responsavel,
    });

    if (!resultado.ok) {
      setFeedback({ tipo: 'erro', mensagem: resultado.erro });
      return;
    }

    setLivroId('');
    setParticipanteId('');
    setFeedback({
      tipo: 'sucesso',
      mensagem: `Empréstimo de "${titulo}" registrado para ${leitor}!`,
    });
  }

  function handleReiniciar() {
    reiniciarDados();
    setLivroId('');
    setParticipanteId('');
    setFeedback({
      tipo: 'sucesso',
      mensagem: 'Dados restaurados para o estado inicial de demonstração.',
    });
  }

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
          Circulação
        </p>
        <Titulo className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-5xl'>
          Registro de{' '}
          <span className='italic text-[#1f3d2e]'>empréstimos</span>
        </Titulo>
        <p className='mt-3 max-w-xl text-base text-[#6b5a4c]'>
          Escolha um livro disponível, vincule ao membro do clube e defina o
          prazo de devolução.
        </p>
      </header>

      {/* Formulário */}
      <section className='mb-8 rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5 sm:p-8'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <h3 className='font-serif text-xl font-semibold text-[#2b1d14]'>
            Registrar retirada
          </h3>
          <button
            type='button'
            onClick={handleReiniciar}
            className='cursor-pointer rounded-lg border border-[#d9c9a8] bg-[#f6efe4] px-3 py-1.5 text-xs font-medium text-[#6b5a4c] transition hover:bg-white'
          >
            Restaurar dados iniciais
          </button>
        </div>

        {feedback && (
          <p
            role={feedback.tipo === 'erro' ? 'alert' : 'status'}
            className={`mb-6 rounded-lg border px-4 py-3 text-sm font-medium ${
              feedback.tipo === 'sucesso'
                ? 'border-[#2f5d46]/30 bg-[#2f5d46]/10 text-[#2f5d46]'
                : 'border-[#8c2f39]/30 bg-[#8c2f39]/10 text-[#8c2f39]'
            }`}
          >
            {feedback.mensagem}
          </p>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div className='space-y-1.5'>
              <label
                htmlFor='emp-livro'
                className='text-sm font-medium text-[#2b1d14]'
              >
                Livro disponível ({livrosDisponiveis.length} no acervo)
              </label>
              <select
                id='emp-livro'
                value={livroId}
                onChange={(e) => setLivroId(e.target.value)}
                className={inputClass}
              >
                <option value=''>-- Selecione um livro --</option>
                {livrosDisponiveis.map((livro) => (
                  <option key={livro.id} value={livro.id}>
                    {livro.titulo}
                    {livro.autor ? ` — ${livro.autor}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='emp-participante'
                className='text-sm font-medium text-[#2b1d14]'
              >
                Participante / leitor
              </label>
              <select
                id='emp-participante'
                value={participanteId}
                onChange={(e) => setParticipanteId(e.target.value)}
                className={inputClass}
              >
                <option value=''>-- Selecione o membro --</option>
                {participantes.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            <div className='space-y-1.5'>
              <label
                htmlFor='emp-retirada'
                className='text-sm font-medium text-[#2b1d14]'
              >
                Data de retirada
              </label>
              <input
                id='emp-retirada'
                type='date'
                value={dataRetirada}
                min={hoje}
                onChange={(e) => handleMudancaRetirada(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='emp-devolucao'
                className='text-sm font-medium text-[#2b1d14]'
              >
                Previsão de devolução
              </label>
              <input
                id='emp-devolucao'
                type='date'
                value={dataPrevista}
                min={dataRetirada}
                onChange={(e) => setDataPrevista(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='emp-responsavel'
                className='text-sm font-medium text-[#2b1d14]'
              >
                Registrado por
              </label>
              <select
                id='emp-responsavel'
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className={inputClass}
              >
                {RESPONSAVEIS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
            <span className='text-xs text-[#a8967f]'>
              Prazo padrão calculado automaticamente: {PRAZO_PADRAO} dias
              corridos.
            </span>
            <button
              type='submit'
              disabled={livrosDisponiveis.length === 0}
              className='cursor-pointer rounded-lg bg-[#1f3d2e] px-5 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#8f8577] disabled:shadow-none'
            >
              Confirmar empréstimo
            </button>
          </div>
        </form>
      </section>

      {/* Empréstimos em andamento */}
      <section className='overflow-hidden rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] shadow-sm shadow-[#5b3a29]/5'>
        <div className='flex items-center justify-between border-b border-[#d9c9a8] p-6'>
          <div>
            <h3 className='font-serif text-xl font-semibold text-[#2b1d14]'>
              Empréstimos em andamento
            </h3>
            <p className='mt-1 text-xs text-[#6b5a4c]'>
              Livros ainda não devolvidos. As devoluções são registradas no
              painel abaixo.
            </p>
          </div>
          <span className='rounded-full bg-[#b88a44]/20 px-3 py-1 text-xs font-semibold text-[#7a5a22]'>
            {emprestimosAtivos.length}{' '}
            {emprestimosAtivos.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-[#f1e8d6] text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
              <tr>
                <th className='p-4'>Livro</th>
                <th className='p-4'>Participante</th>
                <th className='p-4'>Retirada</th>
                <th className='p-4'>Devolução prevista</th>
                <th className='p-4'>Responsável</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[#e4d6b9]'>
              {[...emprestimosAtivos].reverse().map((item) => (
                <tr key={item.id} className='hover:bg-[#f6efe4]'>
                  <td className='p-4 font-serif text-base font-semibold text-[#2b1d14]'>
                    {nomeDoLivro(item.livroId)}
                  </td>
                  <td className='p-4 text-[#6b5a4c]'>
                    {nomeDoLeitor(item.participanteId)}
                  </td>
                  <td className='p-4 tabular-nums text-[#6b5a4c]'>
                    {formatarData(item.dataEmprestimo)}
                  </td>
                  <td className='p-4 font-medium tabular-nums text-[#1f3d2e]'>
                    {formatarData(item.dataDevolucao)}
                  </td>
                  <td className='p-4 text-xs text-[#6b5a4c]'>
                    {item.registradoPor ?? '-'}
                  </td>
                </tr>
              ))}

              {emprestimosAtivos.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='p-10 text-center font-serif text-lg italic text-[#6b5a4c]'
                  >
                    Nenhum empréstimo em andamento.
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
