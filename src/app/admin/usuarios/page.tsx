"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";
import type { User, UserRole } from "@/lib/types";
import { formatDate, roleLabel, uid } from "@/lib/utils";

export default function AdminUsuariosPage() {
  const { store, upsertUser } = useStore();
  const { notify } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "fornecedor" as UserRole,
  });

  function save() {
    if (!form.name.trim() || !form.email.trim()) {
      notify("Informe nome e e-mail");
      return;
    }
    const user: User = {
      id: uid("u"),
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || "Parceiro",
      role: form.role,
      active: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    upsertUser(user);
    setForm({ name: "", email: "", company: "", role: "fornecedor" });
    notify("Usuário cadastrado");
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Fornecedores e usuários</h1>
          <p>Perfis: administrador, gestor de marca, editor e fornecedor.</p>
        </div>
      </div>

      <div className="panel">
        <h2>Novo usuário</h2>
        <div className="form-grid">
          <div className="field">
            <label>Nome</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Empresa</label>
            <input
              className="input"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Perfil</label>
            <select
              className="select"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as UserRole })
              }
            >
              <option value="administrador">Administrador</option>
              <option value="gestor_marca">Gestor de marca</option>
              <option value="editor">Editor de conteúdo</option>
              <option value="fornecedor">Fornecedor</option>
            </select>
          </div>
        </div>
        <Button variant="secondary" onClick={save} style={{ marginTop: 14 }}>
          Cadastrar
        </Button>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Empresa</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Desde</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {store.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.company}</td>
                  <td>{roleLabel(user.role)}</td>
                  <td>{user.active ? "Ativo" : "Inativo"}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        upsertUser({ ...user, active: !user.active });
                        notify(
                          user.active ? "Usuário desativado" : "Usuário ativado"
                        );
                      }}
                    >
                      {user.active ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
