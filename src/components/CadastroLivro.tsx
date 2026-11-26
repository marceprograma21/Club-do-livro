'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { useBiblioteca } from '@/src/context/BibliotecaContext';

const inputClass =
  'w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15';

const FILTROS = ['Todos', 'Disponíveis', 'Emprestados'] as const;

// Reduz a capa para no máximo 480px e salva como JPEG (cabe no localStorage)
function lerImagem(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
      img.onload = () => {
        const escala = Math.min(1, 480 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Não foi possível processar a imagem.'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = String(leitor.result);
    };
    leitor.readAsDataURL(arquivo);
  });
}

/** Cadastro de livros (RF 01) e consulta do acervo com busca e filtros (RF 05 e RF 08). */
export default function CadastroLivro() {
  const { livros, pronto, adicionarLivro } = useBiblioteca();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [inputImagemKey, setInputImagemKey] = useState(0);
  const [feedback, setFeedback] = useState<{
    tipo: 'sucesso' | 'erro';
    mensagem: string;
  } | null>(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('Todos');

  // A mensagem de sucesso some sozinha depois de 4 segundos
  useEffect(() => {
    if (feedback?.tipo !== 'sucesso') return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const termo = busca.trim().toLowerCase();
  // Os livros mais recentes aparecem primeiro
  const livrosFiltrados = [...livros].reverse().filter((livro) => {
    const bateBusca =
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo);
    const bateFiltro =
      filtro === 'Todos' ||
      (filtro === 'Disponíveis' ? livro.disponivel : !livro.disponivel);
    return bateBusca && bateFiltro;
  });

  async function handleImagem(arquivo: File | undefined) {
    if (!arquivo) {
      setImagem('');
      return;
    }
    try {
      setImagem(await lerImagem(arquivo));
    } catch (e) {
      setImagem('');
      setFeedback({
        tipo: 'erro',
        mensagem: e instanceof Error ? e.message : 'Erro ao carregar a imagem.',
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const precoNumero = preco.trim() ? Number(preco.replace(',', '.')) : undefined;
    if (precoNumero !== undefined && (Number.isNaN(precoNumero) || precoNumero < 0)) {
      setFeedback({ tipo: 'erro', mensagem: 'Informe um preço válido.' });
      return;
    }

    const resultado = adicionarLivro({
      titulo,
      autor,
      descricao,
      imagem,
      preco: precoNumero,
    });
    if (!resultado.ok) {
      setFeedback({ tipo: 'erro', mensagem: resultado.erro });
      return;
    }

    setFeedback({
      tipo: 'sucesso',
      mensagem: `"${titulo.trim()}" foi cadastrado e já aparece na estante.`,
    });
    setTitulo('');
    setAutor('');
    setDescricao('');
    setPreco('');
    setImagem('');
    setInputImagemKey((k) => k + 1); // limpa o campo de arquivo
  }

  if (!pronto) return null;

  return (
    <div className='grid gap-8 lg:grid-cols-[1fr_1.2fr]'>
      <form
        onSubmit={handleSubmit}
        className='h-fit space-y-5 rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5 sm:p-8'
      >
        <h3 className='font-serif text-xl font-semibold text-[#2b1d14]'>
          Cadastrar livro
        </h3>

        {feedback && (
          <p
            role={feedback.tipo === 'erro' ? 'alert' : 'status'}
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${
              feedback.tipo === 'sucesso'
                ? 'border-[#2f5d46]/30 bg-[#2f5d46]/10 text-[#2f5d46]'
                : 'border-[#8c2f39]/30 bg-[#8c2f39]/10 text-[#8c2f39]'
            }`}
          >
            {feedback.mensagem}
          </p>
        )}

        <div className='space-y-1.5'>
          <label
            htmlFor='livro-titulo'
            className='text-sm font-medium text-[#2b1d14]'
          >
            Título
          </label>
          <input
            id='livro-titulo'
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder='Ex.: Dom Casmurro'
            className={inputClass}
          />
        </div>

        <div className='space-y-1.5'>
          <label
            htmlFor='livro-autor'
            className='text-sm font-medium text-[#2b1d14]'
          >
            Autor
          </label>
          <input
            id='livro-autor'
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder='Ex.: Machado de Assis'
            className={inputClass}
          />
        </div>

        <div className='space-y-1.5'>
          <label
            htmlFor='livro-descricao'
            className='text-sm font-medium text-[#2b1d14]'
          >
            Descrição <span className='text-[#a8967f]'>(opcional)</span>
          </label>
          <textarea
            id='livro-descricao'
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            placeholder='Uma frase sobre o livro, para a estante'
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className='grid gap-5 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <label
              htmlFor='livro-preco'
              className='text-sm font-medium text-[#2b1d14]'
            >
              Preço <span className='text-[#a8967f]'>(opcional)</span>
            </label>
            <input
              id='livro-preco'
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              inputMode='decimal'
              placeholder='Ex.: 39,90'
              className={inputClass}
            />
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='livro-imagem'
              className='text-sm font-medium text-[#2b1d14]'
            >
              Capa <span className='text-[#a8967f]'>(opcional)</span>
            </label>
            <input
              key={inputImagemKey}
              id='livro-imagem'
              type='file'
              accept='image/*'
              onChange={(e) => handleImagem(e.target.files?.[0])}
              className='w-full text-sm text-[#6b5a4c] file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-[#d9c9a8] file:bg-[#f6efe4] file:px-3 file:py-2 file:text-xs file:font-medium file:text-[#2b1d14] hover:file:bg-white'
            />
          </div>
        </div>

        {imagem && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagem}
            alt='Prévia da capa'
            className='h-28 w-auto rounded-lg border border-[#d9c9a8] object-cover'
          />
        )}

        <p className='text-xs text-[#a8967f]'>
          Todo livro novo entra como disponível e aparece na estante da página
          inicial.
        </p>

        <button
          type='submit'
          className='w-full cursor-pointer rounded-lg bg-[#1f3d2e] px-4 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] active:scale-[0.99]'
        >
          Cadastrar livro
        </button>
      </form>

      <div className='overflow-hidden rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] shadow-sm shadow-[#5b3a29]/5'>
        <div className='flex items-center justify-between border-b border-[#d9c9a8] p-6'>
          <h3 className='font-serif text-xl font-semibold text-[#2b1d14]'>
            Acervo cadastrado
          </h3>
          <span className='rounded-full bg-[#b88a44]/20 px-3 py-1 text-xs font-semibold text-[#7a5a22]'>
            {livrosFiltrados.length} de {livros.length}
          </span>
        </div>

        <div className='space-y-3 border-b border-[#d9c9a8] p-6'>
          <input
            type='search'
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder='Buscar por título ou autor...'
            aria-label='Buscar no acervo'
            className={inputClass}
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
        </div>

        <ul className='max-h-[26rem] divide-y divide-[#e4d6b9] overflow-y-auto'>
          {livrosFiltrados.map((livro) => (
            <li
              key={livro.id}
              className='flex items-center justify-between gap-4 px-6 py-4'
            >
              <div>
                <p className='font-serif text-base font-semibold text-[#2b1d14]'>
                  {livro.titulo}
                </p>
                {livro.autor && (
                  <p className='text-xs text-[#6b5a4c]'>{livro.autor}</p>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  livro.disponivel
                    ? 'bg-[#2f5d46]/15 text-[#2f5d46]'
                    : 'bg-[#8c2f39]/15 text-[#8c2f39]'
                }`}
              >
                {livro.disponivel ? 'Disponível' : 'Emprestado'}
              </span>
            </li>
          ))}

          {livrosFiltrados.length === 0 && (
            <li className='p-10 text-center font-serif text-lg italic text-[#6b5a4c]'>
              {livros.length === 0
                ? 'Nenhum livro cadastrado.'
                : 'Nenhum livro encontrado.'}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}