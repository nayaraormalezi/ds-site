"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { useStore } from "@/lib/store";
import { dashboardStats, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { store } = useStore();
  const stats = dashboardStats(store);

  const downloadsByCategory = store.categories
    .map((cat) => {
      const assets = store.assets.filter((a) => a.categoryIds.includes(cat.id));
      const downloads = assets.reduce((sum, a) => sum + a.downloads, 0);
      return { name: cat.name, downloads };
    })
    .filter((i) => i.downloads > 0)
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 6);

  const maxDownloads = Math.max(...downloadsByCategory.map((i) => i.downloads), 1);
  const topAssets = [...store.assets]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);

  const recent = store.activities.slice(0, 6);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral da governança de assets e campanhas.</p>
        </div>
        <Link className="btn btn-secondary" href="/admin/assets/new">
          Novo asset
        </Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Total de assets</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="kpi-card">
          <span>Publicados</span>
          <strong>{stats.published}</strong>
        </div>
        <div className="kpi-card">
          <span>Em revisão</span>
          <strong>{stats.review}</strong>
        </div>
        <div className="kpi-card">
          <span>Expirados</span>
          <strong>{stats.expired}</strong>
        </div>
        <div className="kpi-card">
          <span>Downloads</span>
          <strong>{stats.downloads}</strong>
        </div>
        <div className="kpi-card">
          <span>Campanhas vigentes</span>
          <strong>{stats.campaigns}</strong>
        </div>
        <div className="kpi-card">
          <span>Solicitações pendentes</span>
          <strong>{stats.pendingRequests}</strong>
        </div>
        <div className="kpi-card">
          <span>Favoritos (usuário)</span>
          <strong>{store.favorites.length}</strong>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 16,
        }}
        className="dash-grid"
      >
        <section className="panel">
          <h2>Downloads por categoria</h2>
          <div className="chart-bars">
            {downloadsByCategory.map((item) => (
              <div className="chart-row" key={item.name}>
                <span>{item.name}</span>
                <div className="bar">
                  <span
                    style={{
                      width: `${Math.round((item.downloads / maxDownloads) * 100)}%`,
                    }}
                  />
                </div>
                <strong>{item.downloads}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Assets mais baixados</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Status</th>
                  <th>Downloads</th>
                </tr>
              </thead>
              <tbody>
                {topAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <Link href={`/admin/assets/${asset.id}/edit`} style={{ color: "var(--blue)" }}>
                        {asset.name}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={asset.status} />
                    </td>
                    <td>{asset.downloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Atividades recentes</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Ação</th>
                <th>Item</th>
                <th>Usuário</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((act) => {
                const user = store.users.find((u) => u.id === act.userId);
                return (
                  <tr key={act.id}>
                    <td>{formatDate(act.createdAt)}</td>
                    <td>{act.action}</td>
                    <td>{act.entityName}</td>
                    <td>{user?.name ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 900px) {
          .dash-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
