"use client";

import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function AdminGuiasPage() {
  const { store } = useStore();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Guias e documentos</h1>
          <p>
            Documentos publicados no portal. Nesta demo, a edição completa dos
            guias é feita via dados seed — a listagem reflete o conteúdo vivo.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Formato</th>
                <th>Páginas</th>
                <th>Atualização</th>
              </tr>
            </thead>
            <tbody>
              {store.guides.map((g) => (
                <tr key={g.id}>
                  <td>{g.title}</td>
                  <td>{g.category}</td>
                  <td>{g.format}</td>
                  <td>{g.pages}</td>
                  <td>{formatDate(g.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
