"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { TiffinMark } from "./TiffinStack";
import { apiFetch } from "@/lib/api";

const links = [
  { href: "/browse", label: "Find a cook" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "COOK" | "ADMIN";
}

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hf_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("hf_user");
      }
    }
    setChecked(true);
  }, []);

  async function handleLogout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout, still clear local state
    }
    localStorage.removeItem("hf_access_token");
    localStorage.removeItem("hf_user");
    setUser(null);
    router.push("/");
  }

  function dashboardHref() {
    if (!user) return "/";
    if (user.role === "COOK") return "/dashboard/cook";
    if (user.role === "ADMIN") return "/dashboard/admin";
    return "/dashboard/customer";
  }

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/8">
      <div className="container-hf flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <TiffinMark />
          <span className="font-display text-xl font-semibold tracking-tight">
            HomeFeast
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!checked ? null : user ? (
            <>
              <Link
                href={dashboardHref()}
                className="text-sm font-medium text-ink/70 hover:text-ink transition-colors px-3 py-2"
              >
                Hello, {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold bg-leaf text-white px-4 py-2.5 rounded-full hover:bg-leaf-deep transition-colors shadow-card"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink/70 hover:text-ink transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-leaf text-white px-4 py-2.5 rounded-full hover:bg-leaf-deep transition-colors shadow-card"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/8 bg-paper">
          <div className="container-hf py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-ink/8">
              {user ? (
                <>
                  <Link href={dashboardHref()} className="text-sm font-medium py-2" onClick={() => setOpen(false)}>
                    Hello, {user.name.split(" ")[0]}
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="text-sm font-semibold bg-leaf text-white px-4 py-2.5 rounded-full text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium py-2" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-semibold bg-leaf text-white px-4 py-2.5 rounded-full text-center"
                    onClick={() => setOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}