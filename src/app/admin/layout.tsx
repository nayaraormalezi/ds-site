"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "@/components/admin/admin.css";
import { useStore } from "@/lib/store";
import { roleLabel } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, store, setCurrentUser } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell">
      {open ? (
        <div className="admin-backdrop" onClick={() => setOpen(false)} />
      ) : null}
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="admin-main">
        <div className="admin-topbar">
          <button
            className="btn btn-outline btn-sm admin-mobile-toggle"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div>
            <strong style={{ color: "var(--blue-deep)" }}>
              Gestão de marca
            </strong>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label className="sr-only" htmlFor="persona">
              Usuário ativo
            </label>
            <select
              id="persona"
              className="select"
              style={{ width: "auto", padding: "8px 12px" }}
              value={currentUser.id}
              onChange={(e) => setCurrentUser(e.target.value)}
            >
              {store.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} · {roleLabel(u.role)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
