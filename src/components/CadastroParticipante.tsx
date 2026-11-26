"use client";

import { useEffect, useState, type FormEvent } from "react";

import { useBiblioteca, type Perfil } from "@/src/context/BibliotecaContext";

const PERFIS: Perfil[] = ["Participante", "Administrador"];

const inputClass =
  "w-full rounded-lg border border-[#d9c9a8] bg-[#fffaf1] px-4 py-3 text-sm text-[#2b1d14] shadow-sm outline-none transition placeholder:text-[#a8967f] focus:border-[#1f3d2e] focus:ring-4 focus:ring-[#1f3d2e]/15";

/** Cadastro de participantes (RF 02): nome e e-mail. */
export default function CadastroParticipante() {
  const { participantes, emprestimos, pronto, adicionarParticipante } =
    useBiblioteca();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState<Perfil>("Participante");
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro";
    mensagem: string;
  } | null>(null);

  // A mensagem de sucesso some sozinha depois de 4 segundos
  useEffect(() => {
    if (feedback?.tipo !== "sucesso") return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const resultado = adicionarParticipante({ nome, email, perfil });
    if (!resultado.ok) {
      setFeedback({ tipo: "erro", mensagem: resultado.erro });
      return;
    }

    setFeedback({
      tipo: "sucesso",
      mensagem: `${nome.trim()} agora faz parte do clube!`,
    });
    setNome("");
    setEmail("");
  }

  function livrosEmAberto(participanteId: string) {
    return emprestimos.filter(
      (e) => e.participanteId === participanteId && !e.devolvidoEm,
    ).length;
  }

  if (!pronto) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        onSubmit={handleSubmit}
        className="h-fit space-y-5 rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] p-6 shadow-sm shadow-[#5b3a29]/5 sm:p-8"
      >
        <h3 className="font-serif text-xl font-semibold text-[#2b1d14]">
          Cadastrar participante
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
            htmlFor="part-nome"
            className="text-sm font-medium text-[#2b1d14]"
          >
            Nome
          </label>
          <input
            id="part-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Nome completo"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="part-email"
            className="text-sm font-medium text-[#2b1d14]"
          >
            E-mail
          </label>
          <input
            id="part-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="part-perfil"
            className="text-sm font-medium text-[#2b1d14]"
          >
            Perfil
          </label>
          <select
            id="part-perfil"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value as Perfil)}
            className={inputClass}
          >
            {PERFIS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-[#1f3d2e] px-4 py-3 text-sm font-semibold text-[#f6efe4] shadow-lg shadow-[#1f3d2e]/25 transition hover:bg-[#2a5240] active:scale-[0.99]"
        >
          Cadastrar participante
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] shadow-sm shadow-[#5b3a29]/5">
        <div className="flex items-center justify-between border-b border-[#d9c9a8] p-6">
          <h3 className="font-serif text-xl font-semibold text-[#2b1d14]">
            Membros do clube
          </h3>
          <span className="rounded-full bg-[#b88a44]/20 px-3 py-1 text-xs font-semibold text-[#7a5a22]">
            {participantes.length}{" "}
            {participantes.length === 1 ? "membro" : "membros"}
          </span>
        </div>

        <ul className="max-h-[26rem] divide-y divide-[#e4d6b9] overflow-y-auto">
          {[...participantes].reverse().map((pessoa) => {
            const abertos = livrosEmAberto(pessoa.id);
            return (
              <li
                key={pessoa.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-serif text-base font-semibold text-[#2b1d14]">
                    {pessoa.nome}
                    {pessoa.perfil === "Administrador" && (
                      <span className="ml-2 rounded-full bg-[#8c2f39]/15 px-2 py-0.5 align-middle font-sans text-[10px] font-semibold uppercase tracking-wider text-[#8c2f39]">
                        Admin
                      </span>
                    )}
                  </p>
                  {pessoa.email && (
                    <p className="text-xs text-[#6b5a4c]">{pessoa.email}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs font-medium text-[#6b5a4c]">
                  {abertos === 0
                    ? "Sem livros emprestados"
                    : `${abertos} ${abertos === 1 ? "livro" : "livros"} em mãos`}
                </span>
              </li>
            );
          })}

          {participantes.length === 0 && (
            <li className="p-10 text-center font-serif text-lg italic text-[#6b5a4c]">
              Nenhum participante cadastrado.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
