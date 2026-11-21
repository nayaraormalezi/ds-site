"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";

const FAQ = [
  {
    q: "Qual versão do logotipo devo utilizar?",
    a: "Use a versão prioritária em fundos claros e a negativa em fundos escuros. Baixe sempre os arquivos oficiais na biblioteca.",
  },
  {
    q: "Posso alterar as cores da marca?",
    a: "Não. Utilize apenas a paleta oficial disponível em Identidade visual e na biblioteca de cores.",
  },
  {
    q: "Posso modificar os elementos gráficos?",
    a: "Não altere proporções, grafismos ou tipografia institucional. Em caso de necessidade especial, abra uma solicitação.",
  },
  {
    q: "Onde encontro imagens dos produtos?",
    a: "Na Biblioteca de assets, filtre por produto (Imobiliário, Veículos Leves ou Pesados) ou pela categoria correspondente.",
  },
  {
    q: "Posso utilizar campanhas anteriores?",
    a: "Somente se o material estiver aprovado e dentro da validade. Campanhas encerradas/expiradas não devem ser reutilizadas.",
  },
  {
    q: "Como solicitar um material?",
    a: "Use o formulário nesta página. O time de marca recebe a solicitação no painel administrativo.",
  },
  {
    q: "Como reportar um arquivo desatualizado?",
    a: "Envie uma solicitação descrevendo o arquivo e o problema. Você também pode falar com marca@caixaconsorcio.com.br.",
  },
];

export default function AjudaPage() {
  const { store, addRequest } = useStore();
  const { notify } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"baixa" | "media" | "alta">("media");

  const fornecedor =
    store.users.find((u) => u.role === "fornecedor") ?? store.users[0];

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="section-label">Suporte</p>
        <h1>Central de ajuda</h1>
        <p>
          Tire dúvidas rápidas e solicite materiais ao time de marca.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 28,
        }}
        className="help-grid"
      >
        <section className="faq">
          <h2 style={{ fontSize: 22, marginBottom: 14, color: "var(--blue-deep)" }}>
            Perguntas frequentes
          </h2>
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>

        <section className="card" style={{ padding: 22, alignSelf: "start" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Solicitar material</h2>
          <p style={{ color: "var(--ink-muted)", fontSize: 14, marginBottom: 16 }}>
            Descreva o que você precisa. A solicitação aparece no painel
            administrativo.
          </p>
          <form
            style={{ display: "grid", gap: 12 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim() || !description.trim()) {
                notify("Preencha título e descrição");
                return;
              }
              addRequest({
                title: title.trim(),
                description: description.trim(),
                requesterId: fornecedor.id,
                priority,
              });
              setTitle("");
              setDescription("");
              setPriority("media");
              notify("Solicitação enviada");
            }}
          >
            <div className="field">
              <label htmlFor="req-title">Título</label>
              <input
                id="req-title"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Banner para PDV — Imobiliário"
              />
            </div>
            <div className="field">
              <label htmlFor="req-desc">Descrição</label>
              <textarea
                id="req-desc"
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contexto, formato, prazo e uso pretendido"
              />
            </div>
            <div className="field">
              <label htmlFor="req-priority">Prioridade</label>
              <select
                id="req-priority"
                className="select"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "baixa" | "media" | "alta")
                }
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <Button type="submit" variant="secondary">
              Enviar solicitação
            </Button>
          </form>
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-muted)" }}>
            Contato:{" "}
            <a href="mailto:marca@caixaconsorcio.com.br" style={{ color: "var(--blue)" }}>
              marca@caixaconsorcio.com.br
            </a>
          </p>
        </section>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .help-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
