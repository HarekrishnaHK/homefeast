import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { TiffinMark } from "./TiffinStack";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  title,
  navItems,
  activeHref,
  children,
}: {
  title: string;
  navItems: NavItem[];
  activeHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-paperDim">
      <aside className="w-64 shrink-0 bg-leaf-deep text-white/90 hidden md:flex flex-col">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/10">
          <TiffinMark />
          <span className="font-display text-lg font-semibold text-white">HomeFeast</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-ink/8 flex items-center px-6 sm:px-10">
          <h1 className="font-display text-xl font-semibold">{title}</h1>
        </header>
        <main className="p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/8 shadow-card">
      <p className="text-xs font-mono uppercase tracking-widest text-clay">{label}</p>
      <p className="font-display text-2xl font-semibold mt-2">{value}</p>
      {hint && <p className="text-xs text-ink/50 mt-1">{hint}</p>}
    </div>
  );
}
