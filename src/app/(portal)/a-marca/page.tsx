import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "A marca",
};

export default function AMarcaPage() {
  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="section-label">Institucional</p>
        <h1>A marca CAIXA Consórcio</h1>
        <p>
          Credibilidade do Grupo CAIXA Seguridade com foco em ajudar pessoas e
          empresas a realizarem conquistas com planejamento.
        </p>
      </div>

      <section className="iv-section" style={{ borderTop: 0, paddingTop: 0 }}>
        <h2>Propósito e posicionamento</h2>
        <p style={{ maxWidth: 720, color: "var(--ink-muted)", fontSize: 17 }}>
          A CAIXA Consórcio existe para transformar planejamento financeiro em
          conquistas reais — sem juros, com transparência e a segurança de uma
          marca pertencente ao ecossistema CAIXA.
        </p>
      </section>

      <section className="iv-section">
        <h2>Proposta de valor</h2>
        <div className="grid-cards">
          {[
            {
              t: "Sem juros",
              d: "Planejamento com taxa de administração clara e previsível.",
            },
            {
              t: "Segurança",
              d: "Regulada pelo Banco Central e parte do Grupo CAIXA Seguridade.",
            },
            {
              t: "Acessibilidade",
              d: "Produtos para imóveis, veículos leves e pesados.",
            },
            {
              t: "Proximidade",
              d: "Canais digitais e atendimento para toda a jornada.",
            },
          ].map((item) => (
            <article key={item.t} className="card" style={{ padding: 22 }}>
              <h3 style={{ color: "var(--blue-deep)", marginBottom: 8 }}>{item.t}</h3>
              <p style={{ color: "var(--ink-muted)" }}>{item.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="iv-section">
        <h2>Arquitetura de produtos</h2>
        <div className="grid-cards">
          {[
            {
              title: "Imobiliário",
              text: "Imóveis residenciais e comerciais, construção, reforma e quitação.",
            },
            {
              title: "Veículos Leves",
              text: "Carros e motos novos ou usados, com prazos e cartas acessíveis.",
            },
            {
              title: "Veículos Pesados",
              text: "Caminhões, ônibus, tratores, máquinas e soluções para o agro.",
            },
          ].map((p) => (
            <article key={p.title} className="card" style={{ padding: 22 }}>
              <p className="section-label">Produto</p>
              <h3 style={{ marginBottom: 8 }}>{p.title}</h3>
              <p style={{ color: "var(--ink-muted)" }}>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="iv-section">
        <h2>Segmentos atendidos</h2>
        <p style={{ color: "var(--ink-muted)", maxWidth: 680, marginBottom: 20 }}>
          Pessoas físicas, famílias, profissionais autônomos, empresas e
          produtores que buscam conquistas com planejamento — do primeiro imóvel
          ao equipamento do negócio.
        </p>
        <Button href="/identidade-visual" variant="secondary">
          Ver identidade visual
        </Button>
      </section>
    </div>
  );
}
