"use client";

import { useEffect, useState, type FormEvent } from "react";

import { useBiblioteca } from "@/src/context/BibliotecaContext";

const inputClass =
  "w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15";

const FILTROS = ["Todos", "Disponíveis", "Emprestados"] as const;

/** Cadastro de livros (RF 01) e consulta do acervo com busca e filtros (RF 05 e RF 08). */
export default function CadastroLivro() {
  const { livros, pronto, adicionarLivro } = useBiblioteca();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro";
    mensagem: string;
  } | null>(null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");

  // A mensagem de sucesso some sozinha depois de 4 segundos
  useEffect(() => {
    if (feedback?.tipo !== "sucesso") return;
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
      filtro === "Todos" ||
      (filtro === "Disponíveis" ? livro.disponivel : !livro.disponivel);
    return bateBusca && bateFiltro;
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const resultado = adicionarLivro({ titulo, autor });
    if (!resultado.ok) {
      setFeedback({ tipo: "erro", mensagem: resultado.erro });
      return;
    }

    setFeedback({
      tipo: "sucesso",
      mensagem: `"${titulo.trim()}" foi cadastrado e já está disponível.`,
    });
    setTitulo("");
    setAutor("");
  }

  if (!pronto) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        onSubmit={handleSubmit}
        className="h-fit space-y-5 rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5 sm:p-8"
      >
        <h3 className="font-serif text-xl font-semibold text-[#2b1d14]">
          Cadastrar livro
        </h3>

        {feedback && (
          <p
            role={feedback.tipo === "erro" ? "alert" : "status"}
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${
              feedback.tipo === "sucesso"
                ? "border-[#2f5d46]/30 bg-[#2f5d46]/10 text-[#2f5d46]"
                : "border-[#8c2f39]/30 bg-[#8c2f39]/10 text-[#8c2f39]"
            }`}
          >
            {feedback.mensagem}
          </p>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="livro-titulo"
            className="text-sm font-medium text-[#2b1d14]"
          >
            Título
          </label>
          <input
            id="livro-titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Ex.: Dom Casmurro"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="livro-autor"
            className="text-sm font-medium text-[#2b1d14]"
          >
            Autor
          </label>
          <input
            id="livro-autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Ex.: Machado de Assis"
            className={inputClass}
          />
        </div>

        <p className="text-xs text-[#a8967f]">
          Todo livro novo entra como disponível para empréstimo.
        </p>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-[#1f3d2e] px-4 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] active:scale-[0.99]"
        >
          Cadastrar livro
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] shadow-sm shadow-[#5b3a29]/5">
        <div className="flex items-center justify-between border-b border-[#d9c9a8] p-6">
          <h3 className="font-serif text-xl font-semibold text-[#2b1d14]">
            Acervo cadastrado
          </h3>
          <span className="rounded-full bg-[#b88a44]/20 px-3 py-1 text-xs font-semibold text-[#7a5a22]">
            {livrosFiltrados.length} de {livros.length}
          </span>
        </div>

        <div className="space-y-3 border-b border-[#d9c9a8] p-6">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título ou autor..."
            aria-label="Buscar no acervo"
            className={inputClass}
          />
          <div className="flex flex-wrap gap-2">
            {FILTROS.map((opcao) => (
              <button
                key={opcao}
                type="button"
                onClick={() => setFiltro(opcao)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filtro === opcao
                    ? "bg-[#1f3d2e] text-[#f6efe4]"
                    : "border border-[#d9c9a8] bg-[#f6efe4] text-[#6b5a4c] hover:bg-white"
                }`}
              >
                {opcao}
              </button>
            ))}
          </div>
        </div>

        <ul className="max-h-[26rem] divide-y divide-[#e4d6b9] overflow-y-auto">
          {livrosFiltrados.map((livro) => (
            <li
              key={livro.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div>
                <p className="font-serif text-base font-semibold text-[#2b1d14]">
                  {livro.titulo}
                </p>
                {livro.autor && (
                  <p className="text-xs text-[#6b5a4c]">{livro.autor}</p>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  livro.disponivel
                    ? "bg-[#2f5d46]/15 text-[#2f5d46]"
                    : "bg-[#8c2f39]/15 text-[#8c2f39]"
                }`}
              >
                {livro.disponivel ? "Disponível" : "Emprestado"}
              </span>
            </li>
          ))}

          {livrosFiltrados.length === 0 && (
            <li className="p-10 text-center font-serif text-lg italic text-[#6b5a4c]">
              {livros.length === 0
                ? "Nenhum livro cadastrado."
                : "Nenhum livro encontrado."}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
