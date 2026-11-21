"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/a-marca", label: "A marca" },
  { href: "/identidade-visual", label: "Identidade visual" },
  { href: "/guias", label: "Guias" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/templates", label: "Templates" },
  { href: "/ajuda", label: "Ajuda" },
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
              className="nav-link"
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Button className="hide-sm" href="/biblioteca" variant="outline" size="sm">
            Biblioteca
          </Button>
          <Button className="hide-sm" href="/admin" variant="secondary" size="sm">
            Painel
          </Button>
          <span className="header-user hide-sm">{currentUser.name.split(" ")[0]}</span>
          <Button
            className="menu-toggle"
            variant="soft"
            size="sm"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </Button>
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
