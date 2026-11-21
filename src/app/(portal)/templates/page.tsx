"use client";

import { downloadTextFile } from "@/lib/download";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function TemplatesPage() {
  const { store } = useStore();
  const { notify } = useToast();

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="section-label">Modelos</p>
        <h1>Templates</h1>
        <p>
          Modelos editáveis para acelerar produções mantendo consistência com a
          marca.
        </p>
      </div>

      <div className="grid-cards">
        {store.templates.map((tpl) => (
          <article key={tpl.id} className="card card-interactive">
            <div className="thumb" style={{ background: tpl.coverGradient }}>
              <span>{tpl.coverLabel}</span>
            </div>
            <div style={{ padding: 18 }}>
              <p className="section-label" style={{ fontSize: 11 }}>
                {tpl.category}
              </p>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{tpl.name}</h3>
              <p style={{ color: "var(--ink-muted)", fontSize: 14, minHeight: 44 }}>
                {tpl.description}
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "12px 0" }}>
                Formato {tpl.editableFormat} · Atualizado em {formatDate(tpl.updatedAt)}
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  downloadTextFile(
                    `${tpl.name}.${tpl.editableFormat.toLowerCase()}.txt`,
                    tpl.content
                  );
                  notify("Template baixado");
                }}
              >
                Baixar template
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
