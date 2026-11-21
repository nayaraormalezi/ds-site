"use client";

import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";
import type { RequestStatus } from "@/lib/types";
import { formatDate, requestStatusLabel } from "@/lib/utils";

const STATUSES: RequestStatus[] = [
  "recebida",
  "em_analise",
  "em_atendimento",
  "concluida",
  "recusada",
];

export default function AdminSolicitacoesPage() {
  const { store, updateRequestStatus } = useStore();
  const { notify } = useToast();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Solicitações</h1>
          <p>Trate pedidos e reports enviados pelos fornecedores.</p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Solicitante</th>
                <th>Prioridade</th>
                <th>Criada</th>
                <th>Status</th>
                <th>Atualizar</th>
              </tr>
            </thead>
            <tbody>
              {store.requests.map((req) => {
                const user = store.users.find((u) => u.id === req.requesterId);
                return (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.title}</strong>
                      <div style={{ color: "var(--ink-muted)", fontSize: 13 }}>
                        {req.description}
                      </div>
                    </td>
                    <td>
                      {user?.name}
                      <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                        {user?.company}
                      </div>
                    </td>
                    <td>{req.priority}</td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td>{requestStatusLabel(req.status)}</td>
                    <td>
                      <select
                        className="select"
                        style={{ width: "auto" }}
                        value={req.status}
                        onChange={(e) => {
                          updateRequestStatus(
                            req.id,
                            e.target.value as RequestStatus
                          );
                          notify("Status da solicitação atualizado");
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {requestStatusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
