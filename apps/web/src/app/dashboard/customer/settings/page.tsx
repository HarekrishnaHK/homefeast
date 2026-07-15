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

interface Me {
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("hf_access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    apiFetch<{ data: Me }>("/api/users/me", { accessToken: token })
      .then((res) => setMe(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"));
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    setSaving(true);
    const token = localStorage.getItem("hf_access_token");
    const form = new FormData(e.currentTarget);

    try {
      const res = await apiFetch<{ data: Me }>("/api/users/me", {
        method: "PUT",
        accessToken: token ?? undefined,
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone") || undefined,
          city: form.get("city") || undefined,
        }),
      });
      setMe(res.data);
      const stored = localStorage.getItem("hf_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem("hf_user", JSON.stringify({ ...parsed, name: res.data.name }));
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell title="Settings" navItems={navItems} activeHref="/dashboard/customer/settings">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-6">
          {error}
        </div>
      )}
      {saved && (
        <div className="text-sm text-leaf bg-leaf/10 border border-leaf/20 rounded-lg px-4 py-2.5 mb-6">
          Changes saved.
        </div>
      )}
      {!me && !error && <p className="text-sm text-ink/50">Loading profile...</p>}
      {me && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-ink/8 shadow-card p-6 sm:p-8 max-w-lg space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={me.email}
              disabled
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm bg-paperDim text-ink/50"
            />
          </div>
          <div>
            <label htmlFor="name" className="text-sm font-medium">Full name</label>
            <input
              id="name"
              name="name"
              defaultValue={me.name}
              required
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <input
              id="phone"
              name="phone"
              defaultValue={me.phone ?? ""}
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>
          <div>
            <label htmlFor="city" className="text-sm font-medium">City</label>
            <input
              id="city"
              name="city"
              defaultValue={me.city ?? ""}
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-leaf text-white font-semibold px-6 py-3 rounded-full hover:bg-leaf-deep transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </DashboardShell>
  );
}