'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { PRODUCTS } from '@/src/utils/products';
import { dataRelativa } from '@/src/utils/datas';

/* ───────── Tipos ───────── */

export type Livro = {
  id: string;
  titulo: string;
  autor: string;
  disponivel: boolean;
  /** Dados opcionais para mostrar o livro na estante da página inicial */
  descricao?: string;
  /** Capa como data URL (já reduzida) */
  imagem?: string;
  preco?: number;
};

export type Perfil = 'Administrador' | 'Participante';

export type Participante = {
  id: string;
  nome: string;
  email: string;
  /** Perfil de acesso (RF 09). Participantes antigos sem perfil contam como "Participante". */
  perfil?: Perfil;
};

export type Emprestimo = {
  id: string;
  livroId: string;
  participanteId: string;
  dataEmprestimo: string;
  dataDevolucao: string;
  devolvidoEm: string | null;
  /** Quem registrou o empréstimo (RF 03). Opcional: empréstimos antigos não têm. */
  registradoPor?: string;
};

type Dados = {
  livros: Livro[];
  participantes: Participante[];
  emprestimos: Emprestimo[];
};

export type Resultado = { ok: true } | { ok: false; erro: string };

type BibliotecaContextValue = Dados & {
  /** false até ler o localStorage (evita mostrar dados de exemplo por um instante) */
  pronto: boolean;
  adicionarLivro: (dados: {
    titulo: string;
    autor: string;
    descricao?: string;
    imagem?: string;
    preco?: number;
  }) => Resultado;
  adicionarParticipante: (dados: {
    nome: string;
    email: string;
    perfil?: Perfil;
  }) => Resultado;
  registrarEmprestimo: (dados: {
    livroId: string;
    participanteId: string;
    /** Prazo em dias, usado se dataDevolucao não for informada (padrão 7) */
    dias?: number;
    /** Datas no formato AAAA-MM-DD (RF 06). Padrão: hoje e hoje + dias */
    dataEmprestimo?: string;
    dataDevolucao?: string;
    registradoPor?: string;
  }) => Resultado;
  registrarDevolucao: (emprestimoId: string) => Resultado;
  /** Volta aos dados de exemplo (útil para repetir os testes) */
  reiniciarDados: () => void;
};

/* ───────── Dados iniciais ───────── */

const CHAVE_STORAGE = 'clube-do-livro:biblioteca:v1';

// Coloque em false para começar com tudo vazio (sem empréstimos de exemplo).
const DADOS_DEMO = true;

const NOMES_DEMO = [
  'Lucas Silva',
  'Mariana Costa',
  'Pedro Almeida',
  'Ana Oliveira',
];

// [dias desde hoje do empréstimo, do prazo, da devolução (null = não devolvido)]
const EMPRESTIMOS_DEMO: [number, number, number | null][] = [
  [-10, -3, null],
  [-5, 2, null],
  [-7, 5, null],
  [-15, -5, -4],
];

function gerarId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  );
}

function criarDadosIniciais(): Dados {
  // O acervo parte dos livros que já existem em PRODUCTS
  const livros: Livro[] = PRODUCTS.map((p) => ({
    id: String(p.id),
    titulo: p.title,
    autor: '',
    disponivel: p.isAvailable,
  }));

  if (!DADOS_DEMO) {
    return { livros, participantes: [], emprestimos: [] };
  }

  const participantes: Participante[] = NOMES_DEMO.map((nome, i) => ({
    id: `p${i + 1}`,
    nome,
    email: '',
    perfil: 'Participante',
  }));

  const emprestimos: Emprestimo[] = [];

  EMPRESTIMOS_DEMO.forEach(([inicio, prazo, devolucao], i) => {
    const livro = livros[i];
    const participante = participantes[i];
    if (!livro || !participante) return;

    // livro emprestado e não devolvido → fica indisponível
    livro.disponivel = devolucao !== null;

    emprestimos.push({
      id: `e${i + 1}`,
      livroId: livro.id,
      participanteId: participante.id,
      dataEmprestimo: dataRelativa(inicio),
      dataDevolucao: dataRelativa(prazo),
      devolvidoEm: devolucao === null ? null : dataRelativa(devolucao),
    });
  });

  return { livros, participantes, emprestimos };
}

function dadosValidos(valor: unknown): valor is Dados {
  if (!valor || typeof valor !== 'object') return false;
  const v = valor as Partial<Dados>;
  return (
    Array.isArray(v.livros) &&
    Array.isArray(v.participantes) &&
    Array.isArray(v.emprestimos)
  );
}

/* ───────── Context ───────── */

const BibliotecaContext = createContext<BibliotecaContextValue | null>(null);

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<Dados>(criarDadosIniciais);
  const [pronto, setPronto] = useState(false);

  // Carrega do localStorage uma vez (só no navegador)
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) {
        const lido: unknown = JSON.parse(salvo);
        if (dadosValidos(lido)) setDados(lido);
      }
    } catch {
      // se estiver corrompido, seguimos com os dados iniciais
    }
    setPronto(true);
  }, []);

  // Salva a cada mudança
  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
    } catch {
      // armazenamento cheio ou bloqueado: o site continua funcionando
    }
  }, [dados, pronto]);

  /* ── RF 01: cadastro de livros ── */
  function adicionarLivro({
    titulo,
    autor,
    descricao,
    imagem,
    preco,
  }: {
    titulo: string;
    autor: string;
    descricao?: string;
    imagem?: string;
    preco?: number;
  }): Resultado {
    const tituloLimpo = titulo.trim();
    if (!tituloLimpo) return { ok: false, erro: 'Informe o título do livro.' };

    const jaExiste = dados.livros.some(
      (l) => l.titulo.toLowerCase() === tituloLimpo.toLowerCase(),
    );
    if (jaExiste) return { ok: false, erro: 'Este livro já está cadastrado.' };

    const novo: Livro = {
      id: gerarId(),
      titulo: tituloLimpo,
      autor: autor.trim(),
      disponivel: true,
      descricao: descricao?.trim() || undefined,
      imagem: imagem || undefined,
      preco,
    };
    setDados((atual) => ({ ...atual, livros: [...atual.livros, novo] }));
    return { ok: true };
  }

  /* ── RF 02: cadastro de participantes ── */
  function adicionarParticipante({
    nome,
    email,
    perfil = 'Participante',
  }: {
    nome: string;
    email: string;
    perfil?: Perfil;
  }): Resultado {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return { ok: false, erro: 'Informe o nome do participante.' };

    const emailLimpo = email.trim();
    if (
      emailLimpo &&
      dados.participantes.some(
        (p) => p.email.toLowerCase() === emailLimpo.toLowerCase(),
      )
    ) {
      return { ok: false, erro: 'Já existe um participante com este e-mail.' };
    }

    const novo: Participante = {
      id: gerarId(),
      nome: nomeLimpo,
      email: emailLimpo,
      perfil,
    };
    setDados((atual) => ({
      ...atual,
      participantes: [...atual.participantes, novo],
    }));
    return { ok: true };
  }

  /* ── RF 03: registrar empréstimo ── */
  function registrarEmprestimo({
    livroId,
    participanteId,
    dias = 7,
    dataEmprestimo,
    dataDevolucao,
    registradoPor,
  }: {
    livroId: string;
    participanteId: string;
    dias?: number;
    dataEmprestimo?: string;
    dataDevolucao?: string;
    registradoPor?: string;
  }): Resultado {
    const livro = dados.livros.find((l) => l.id === livroId);
    if (!livro) return { ok: false, erro: 'Livro não encontrado.' };
    if (!livro.disponivel) {
      return { ok: false, erro: 'Este livro já está emprestado.' };
    }

    const participante = dados.participantes.find(
      (p) => p.id === participanteId,
    );
    if (!participante) {
      return { ok: false, erro: 'Participante não encontrado.' };
    }

    const hoje = dataRelativa(0);
    const inicio = dataEmprestimo || hoje;
    const prazo = dataDevolucao || dataRelativa(dias);

    // RF 06: controle de datas
    if (inicio < hoje) {
      return { ok: false, erro: 'A data de retirada não pode ser anterior a hoje.' };
    }
    if (prazo < inicio) {
      return {
        ok: false,
        erro: 'A data de devolução não pode ser anterior à data de retirada.',
      };
    }

    const novo: Emprestimo = {
      id: gerarId(),
      livroId,
      participanteId,
      dataEmprestimo: inicio,
      dataDevolucao: prazo,
      devolvidoEm: null,
      registradoPor,
    };

    setDados((atual) => ({
      ...atual,
      emprestimos: [...atual.emprestimos, novo],
      livros: atual.livros.map((l) =>
        l.id === livroId ? { ...l, disponivel: false } : l,
      ),
    }));
    return { ok: true };
  }

  /* ── RF 04: registrar devolução ── */
  function registrarDevolucao(emprestimoId: string): Resultado {
    const emprestimo = dados.emprestimos.find((e) => e.id === emprestimoId);
    if (!emprestimo) return { ok: false, erro: 'Empréstimo não encontrado.' };
    if (emprestimo.devolvidoEm) {
      return { ok: false, erro: 'Este livro já foi devolvido.' };
    }

    const hoje = dataRelativa(0);

    setDados((atual) => ({
      ...atual,
      emprestimos: atual.emprestimos.map((e) =>
        e.id === emprestimoId ? { ...e, devolvidoEm: hoje } : e,
      ),
      // o livro volta a ficar disponível no acervo
      livros: atual.livros.map((l) =>
        l.id === emprestimo.livroId ? { ...l, disponivel: true } : l,
      ),
    }));
    return { ok: true };
  }

  function reiniciarDados() {
    setDados(criarDadosIniciais());
  }

  return (
    <BibliotecaContext.Provider
      value={{
        ...dados,
        pronto,
        adicionarLivro,
        adicionarParticipante,
        registrarEmprestimo,
        registrarDevolucao,
        reiniciarDados,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
}

export function useBiblioteca() {
  const contexto = useContext(BibliotecaContext);
  if (!contexto) {
    throw new Error('useBiblioteca deve ser usado dentro de <BibliotecaProvider>.');
  }
  return contexto;
}