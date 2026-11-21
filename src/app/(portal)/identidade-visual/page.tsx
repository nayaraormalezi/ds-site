"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const COLORS = [
  {
    name: "Azul CAIXA",
    hex: "#005CA9",
    rgb: "0, 92, 169",
    cmyk: "100, 68, 0, 7",
  },
  {
    name: "Azul profundo",
    hex: "#003D73",
    rgb: "0, 61, 115",
    cmyk: "100, 78, 20, 28",
  },
  {
    name: "Laranja",
    hex: "#F39200",
    rgb: "243, 146, 0",
    cmyk: "0, 48, 100, 0",
  },
  {
    name: "Ink",
    hex: "#232B35",
    rgb: "35, 43, 53",
    cmyk: "70, 55, 45, 55",
  },
  {
    name: "Ink muted",
    hex: "#616D7A",
    rgb: "97, 109, 122",
    cmyk: "55, 35, 30, 15",
  },
  {
    name: "Fundo suave",
    hex: "#F5F7F9",
    rgb: "245, 247, 249",
    cmyk: "3, 1, 1, 0",
  },
];

const SECTIONS = [
  { id: "logos", label: "Logotipos" },
  { id: "assinaturas", label: "Assinaturas" },
  { id: "cores", label: "Cores" },
  { id: "tipografia", label: "Tipografia" },
  { id: "grafismos", label: "Elementos gráficos" },
  { id: "fotografia", label: "Fotografia" },
  { id: "composicao", label: "Composição" },
  { id: "corretas", label: "Aplicações corretas" },
  { id: "incorretas", label: "Aplicações incorretas" },
];

export default function IdentidadeVisualPage() {
  const { notify } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      notify(`HEX ${hex} copiado`);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      notify("Não foi possível copiar");
    }
  }

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="section-label">Diretrizes</p>
        <h1>Identidade visual</h1>
        <p>
          Consulte as diretrizes oficiais da marca. Os exemplos abaixo usam
          placeholders editáveis até a publicação dos assets finais.
        </p>
      </div>

      <nav className="iv-nav" aria-label="Seções da identidade">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.label}
          </a>
        ))}
      </nav>

      <section className="iv-section" id="logos">
        <h2>Logotipos</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680 }}>
          Utilize sempre os arquivos oficiais. Não reconstrua o logo a partir do
          desenho. Versões prioritária e negativa estão na biblioteca.
        </p>
        <div className="grid-cards" style={{ marginTop: 18 }}>
          <article className="card">
            <div
              className="thumb"
              style={{ background: "linear-gradient(135deg,#F5F7F9,#E8EEF5)", color: "var(--blue-deep)" }}
            >
              <span>Prioritária</span>
            </div>
            <div style={{ padding: 16 }}>
              <h3>Versão prioritária</h3>
              <p style={{ color: "var(--ink-muted)", fontSize: 14, margin: "8px 0 14px" }}>
                Fundos claros e aplicações institucionais.
              </p>
              <Button href="/biblioteca/asset-logo-pri" variant="secondary" size="sm">
                Ver na biblioteca
              </Button>
            </div>
          </article>
          <article className="card">
            <div
              className="thumb"
              style={{ background: "linear-gradient(135deg,#003D73,#005CA9)" }}
            >
              <span>Negativa</span>
            </div>
            <div style={{ padding: 16 }}>
              <h3>Versão negativa</h3>
              <p style={{ color: "var(--ink-muted)", fontSize: 14, margin: "8px 0 14px" }}>
                Fundos escuros e fotografias densas.
              </p>
              <Button href="/biblioteca/asset-logo-neg" variant="secondary" size="sm">
                Ver na biblioteca
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="iv-section" id="assinaturas">
        <h2>Assinaturas</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680 }}>
          A assinatura oficial combina símbolo e wordmark. Mantenha a área de
          proteção e a redução máxima definidas no guia oficial.
        </p>
      </section>

      <section className="iv-section" id="cores">
        <h2>Paleta de cores</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680 }}>
          Clique para copiar o código HEX. RGB e CMYK são referências para
          digitais e impressos.
        </p>
        <div className="color-grid">
          {COLORS.map((color) => (
            <article key={color.hex} className="color-swatch">
              <div
                className="color-swatch__chip"
                style={{ background: color.hex }}
              />
              <div className="color-swatch__body">
                <strong>{color.name}</strong>
                <code>HEX {color.hex}</code>
                <code>RGB {color.rgb}</code>
                <code>CMYK {color.cmyk}</code>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 10 }}
                  onClick={() => copyHex(color.hex)}
                >
                  {copied === color.hex ? "Copiado" : "Copiar HEX"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="iv-section" id="tipografia">
        <h2>Tipografia</h2>
        <p style={{ color: "var(--ink-muted)", marginBottom: 16 }}>
          Família institucional: <strong>CAIXA Std</strong> (Light, Regular,
          SemiBold, Bold).
        </p>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontWeight: 300, fontSize: 28, marginBottom: 8 }}>
            CAIXA Std Light
          </p>
          <p style={{ fontWeight: 400, fontSize: 28, marginBottom: 8 }}>
            CAIXA Std Regular
          </p>
          <p style={{ fontWeight: 600, fontSize: 28, marginBottom: 8 }}>
            CAIXA Std SemiBold
          </p>
          <p style={{ fontWeight: 700, fontSize: 28 }}>CAIXA Std Bold</p>
        </div>
      </section>

      <section className="iv-section" id="grafismos">
        <h2>Elementos gráficos</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680 }}>
          Grafismos e formas de apoio devem reforçar a marca sem competir com o
          logo. Placeholders — substituir pelos oficiais quando disponíveis.
        </p>
      </section>

      <section className="iv-section" id="fotografia">
        <h2>Fotografia</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680 }}>
          Priorize imagens reais de conquistas, pessoas e contextos de produto.
          Evite stock genérico desalinhado ao tom da marca.
        </p>
      </section>

      <section className="iv-section" id="composicao">
        <h2>Composição</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680 }}>
          Hierarquia clara: marca → mensagem → CTA. Respeite grids, margens e
          contraste entre tipografia e fundos.
        </p>
      </section>

      <section className="iv-section" id="corretas">
        <h2>Aplicações corretas</h2>
        <div className="do-dont">
          <article className="do">
            <h3>Faça</h3>
            <ul style={{ marginTop: 10, paddingLeft: 18, color: "var(--ink-muted)" }}>
              <li>Usar arquivos oficiais da biblioteca</li>
              <li>Respeitar área de proteção</li>
              <li>Garantir contraste adequado</li>
              <li>Manter tipografia CAIXA Std</li>
            </ul>
          </article>
          <article className="dont">
            <h3>Evite</h3>
            <ul style={{ marginTop: 10, paddingLeft: 18, color: "var(--ink-muted)" }}>
              <li>Reconstruir o logo manualmente</li>
              <li>Alterar cores institucionais</li>
              <li>Distorcer proporções</li>
              <li>Usar versões expiradas ou arquivadas</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="iv-section" id="incorretas">
        <h2>Aplicações incorretas</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680, marginBottom: 16 }}>
          Não aplicar sombra, outline, rotação ou efeitos não previstos. Em caso
          de dúvida, consulte o time de marca.
        </p>
        <Button href="/ajuda" variant="outline">
          Tirar dúvidas
        </Button>
      </section>
    </div>
  );
}
