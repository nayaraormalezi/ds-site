"use client";

import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function AdminHistoricoPage() {
  const { store } = useStore();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Histórico de atividades</h1>
          <p>
            Inclusões, alterações de status, publicações, arquivamentos e
            atualizações.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Ação</th>
                <th>Tipo</th>
                <th>Item</th>
                <th>Usuário</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {store.activities.map((act) => {
                const user = store.users.find((u) => u.id === act.userId);
                return (
                  <tr key={act.id}>
                    <td>{formatDate(act.createdAt)}</td>
                    <td>{act.action}</td>
                    <td>{act.entityType}</td>
                    <td>{act.entityName}</td>
                    <td>{user?.name ?? "—"}</td>
                    <td>{act.details ?? "—"}</td>
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
