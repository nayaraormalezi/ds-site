"use client";

import { downloadTextFile } from "@/lib/download";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import type { Guide } from "@/lib/types";

export default function GuiasPage() {
  const { store } = useStore();
  const { notify } = useToast();
  const [preview, setPreview] = useState<Guide | null>(null);

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="section-label">Documentos</p>
        <h1>Guias e orientações</h1>
        <p>
          Biblioteca de documentos oficiais para orientar linguagem, campanhas e
          aplicações da marca.
        </p>
      </div>

      <div className="grid-cards">
        {store.guides.map((guide) => (
          <article key={guide.id} className="card card-interactive">
            <div className="thumb" style={{ background: guide.coverGradient }}>
              <span>{guide.format}</span>
            </div>
            <div style={{ padding: 18 }}>
              <p className="section-label" style={{ fontSize: 11 }}>
                {guide.category}
              </p>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{guide.title}</h3>
              <p style={{ color: "var(--ink-muted)", fontSize: 14, minHeight: 44 }}>
                {guide.description}
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "12px 0" }}>
                Atualizado em {formatDate(guide.updatedAt)} · {guide.pages} páginas ·{" "}
                {guide.format}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setPreview(guide)}
                >
                  Visualizar
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    downloadTextFile(
                      `${guide.title}.txt`,
                      guide.content,
                      "text/plain"
                    );
                    notify("Download do guia iniciado");
                  }}
                >
                  Baixar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={!!preview}
        title={preview?.title ?? ""}
        onClose={() => setPreview(null)}
      >
        {preview ? (
          <div>
            <p style={{ color: "var(--ink-muted)", marginBottom: 16 }}>
              {preview.description}
            </p>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "var(--bg-soft)",
                padding: 16,
                borderRadius: 12,
                fontFamily: "var(--font)",
                fontSize: 14,
              }}
            >
              {preview.content}
            </pre>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
