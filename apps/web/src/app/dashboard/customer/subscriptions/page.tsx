"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, Repeat, Heart, Star, Settings } from "lucide-react";
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

interface Subscription {
  id: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  cook: { businessName: string };
  menu: { name: string };
}

export default function CustomerSubscriptionsPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<Subscription[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("hf_access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    apiFetch<{ data: Subscription[] }>("/api/subscriptions", { accessToken: token })
      .then((res) => setSubs(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load subscriptions"));
  }, [router]);

  return (
    <DashboardShell title="Subscriptions" navItems={navItems} activeHref="/dashboard/customer/subscriptions">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-6">
          {error}
        </div>
      )}
      {!subs && !error && <p className="text-sm text-ink/50">Loading subscriptions...</p>}
      {subs && subs.length === 0 && (
        <p className="text-sm text-ink/50">You don't have any active subscriptions yet.</p>
      )}
      {subs && subs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subs.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-6 border border-ink/8 shadow-card">
              <span className="font-mono text-[11px] uppercase tracking-widest text-clay">{s.planType}</span>
              <h3 className="font-display text-lg font-semibold mt-1">{s.menu.name}</h3>
              <p className="text-sm text-ink/60 mt-1">{s.cook.businessName}</p>
              <p className="text-xs text-ink/50 mt-3">
                {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-leaf/10 text-leaf">
                  {s.status}
                </span>
                {s.autoRenew && (
                  <span className="text-xs text-ink/50">Auto-renews</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}