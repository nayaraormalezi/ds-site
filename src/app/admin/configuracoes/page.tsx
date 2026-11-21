"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";

export default function AdminConfigPage() {
  const { resetDemo, store } = useStore();
  const { notify } = useToast();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Configurações</h1>
          <p>Preferências do ambiente demonstrativo do DAM.</p>
        </div>
      </div>

      <div className="panel">
        <h2>Dados de demonstração</h2>
        <p style={{ color: "var(--ink-muted)", marginBottom: 14 }}>
          A aplicação persiste alterações no navegador (localStorage). Use o
          reset para restaurar o seed oficial do portal.
        </p>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 16 }}>
          Inicializado em: {store.initializedAt}
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (
              window.confirm(
                "Restaurar dados demonstrativos? Alterações locais serão perdidas."
              )
            ) {
              resetDemo();
              notify("Dados demonstrativos restaurados");
            }
          }}
        >
          Restaurar seed
        </Button>
      </div>

      <div className="panel">
        <h2>Integração futura</h2>
        <p style={{ color: "var(--ink-muted)" }}>
          A camada <code>lib/store</code> está desacoplada da interface. Em
          produção, substitua a persistência local por API + storage de arquivos,
          mantendo os mesmos contratos de tipos em <code>lib/types.ts</code>.
        </p>
      </div>
    </div>
  );
}
