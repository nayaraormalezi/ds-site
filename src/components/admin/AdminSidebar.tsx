"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/assets", label: "Biblioteca de assets" },
  { href: "/admin/campanhas", label: "Campanhas" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/guias", label: "Guias e documentos" },
  { href: "/admin/usuarios", label: "Fornecedores e usuários" },
  { href: "/admin/solicitacoes", label: "Solicitações" },
  { href: "/admin/historico", label: "Histórico de atividades" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <div className="brand">
        <strong>CAIXA Consórcio</strong>
        <span>Painel de marca</span>
      </div>
      <nav className="admin-nav" aria-label="Administração">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
            >
              {item.label}
            </Link>
          );
        })}
        <Link href="/" onClick={onClose}>
          ← Voltar ao portal
        </Link>
      </nav>
    </aside>
  );
}
