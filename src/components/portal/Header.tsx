"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/a-marca", label: "A marca" },
  { href: "/identidade-visual", label: "Identidade visual" },
  { href: "/guias", label: "Guias e orientações" },
  { href: "/biblioteca", label: "Biblioteca de assets" },
  { href: "/templates", label: "Templates" },
  { href: "/ajuda", label: "Central de ajuda" },
];

export function Header() {
  const pathname = usePathname();
  const { currentUser } = useStore();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/" aria-label="CAIXA Consórcio — Portal de Marca">
          <Image src="/brand/logo.svg" alt="CAIXA Consórcio" width={97} height={45} priority />
        </Link>

        <nav className="nav-main" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="btn btn-outline btn-sm hide-sm" href="/biblioteca">
            Biblioteca
          </Link>
          <Link className="btn btn-secondary btn-sm hide-sm" href="/admin">
            Painel
          </Link>
          <span className="hide-sm" style={{ fontSize: 13, color: "var(--ink-muted)" }}>
            {currentUser.name.split(" ")[0]}
          </span>
          <button
            className="btn btn-soft btn-sm menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-label="Mobile"
      >
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href="/admin" onClick={() => setOpen(false)}>
          Painel administrativo
        </Link>
      </nav>
    </header>
  );
}
