import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "A · Painel" },
  { to: "/tecnologia", label: "B · Tecnologia" },
  { to: "/simulador-chuva", label: "C · Águas pluviais" },
  { to: "/infraestrutura", label: "D · Infraestrutura" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-sans">
      <header className="bg-asphalt text-asphalt-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight">SADRE</span>
            <span className="rounded bg-accent px-1.5 font-mono text-xs font-semibold text-accent-foreground">2.0</span>
          </Link>
          <nav className="flex flex-wrap gap-1 font-mono text-xs">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="rounded px-3 py-2 hover:bg-primary"
                activeOptions={{ exact: true }} activeProps={{ className: "bg-primary" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="h-1 bg-[repeating-linear-gradient(90deg,var(--accent)_0_24px,transparent_24px_48px)]" />
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <footer className="border-t border-border py-6 text-center font-mono text-xs text-muted-foreground">
        SADRE 2.0 · Projeto conceitual em desenvolvimento · Fortaleza, CE · Dados demonstrativos
      </footer>
    </div>
  );
}

export function SimNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded border-l-4 border-accent bg-warning p-3 text-sm text-warning-foreground">
      ⚠ {children}
    </div>
  );
}

export function Tag({ kind }: { kind: "existente" | "adaptacao" | "pesquisa" }) {
  const map = {
    existente: ["Tecnologia existente", "bg-secondary text-secondary-foreground"],
    adaptacao: ["Adaptação proposta", "bg-primary text-primary-foreground"],
    pesquisa: ["Em pesquisa", "bg-accent text-accent-foreground"],
  } as const;
  const [l, c] = map[kind];
  return <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${c}`}>{l}</span>;
}
