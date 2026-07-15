"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Repeat, Heart, Star, Settings, MapPin } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { apiFetch } from "@/lib/api";

const navItems = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/orders", label: "Orders", icon: Package },
  { href: "/dashboard/customer/subscriptions", label: "Subscriptions", icon: Repeat },
  { href: "/dashboard/customer/saved", label: "Saved providers", icon: Heart },
  { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/customer/settings", label: "Settings", icon: Settings },
];

interface Favorite {
  id: string;
  cook: { slug: string; businessName: string; city: string; avgRating: number };
}

export default function SavedProvidersPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("hf_access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    apiFetch<{ data: Favorite[] }>("/api/users/me/favorites", { accessToken: token })
      .then((res) => setFavorites(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load saved providers"));
  }, [router]);

  return (
    <DashboardShell title="Saved providers" navItems={navItems} activeHref="/dashboard/customer/saved">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-6">
          {error}
        </div>
      )}
      {!favorites && !error && <p className="text-sm text-ink/50">Loading saved providers...</p>}
      {favorites && favorites.length === 0 && (
        <p className="text-sm text-ink/50">
          You haven't saved any providers yet. <Link href="/browse" className="text-leaf font-medium hover:underline">Browse cooks</Link>.
        </p>
      )}
      {favorites && favorites.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f) => (
            <Link
              key={f.id}
              href={`/provider/${f.cook.slug}`}
              className="bg-white rounded-2xl p-6 border border-ink/8 shadow-card hover:shadow-soft transition-shadow"
            >
              <h3 className="font-display text-lg font-semibold">{f.cook.businessName}</h3>
              <p className="text-sm text-ink/60 mt-1 flex items-center gap-1">
                <MapPin size={13} /> {f.cook.city}
              </p>
              <p className="text-sm text-ink/50 mt-2">★ {f.cook.avgRating.toFixed(1)}</p>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}